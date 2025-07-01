from langchain_ollama.llms import OllamaLLM  # Corrected import
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda, RunnableParallel
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_ollama.embeddings import OllamaEmbeddings
from vellore_knowledge import vellore_knowledge
import os

# Restrict assistant to only answer about Vellore and its district
def filter_query(query: str) -> str:
    # Use the LLM to check if the question is about Vellore or its district
    check_prompt = (
        "Answer only 'yes' or 'no'. Is the following question about Vellore city, Vellore district, or travel to Vellore (including places like Yelagiri, Amirthi, Sripuram, etc.)?\n"
        f"Question: {query}\nAnswer:"
    )
    check_llm = OllamaLLM(model="llama3")
    response = check_llm.invoke(check_prompt).strip().lower()
    if response.startswith("yes"):
        return query
    return "Sorry, I can only answer questions about Vellore city and its district (including places like Yelagiri, Amirthi, Sripuram, etc.), or about how to travel to Vellore."

# Format knowledge base for context
knowledge_context = "\n".join([
    f"{item['name']}: {item['description']} (Location: {item['location']})" for item in vellore_knowledge
])

prompt = ChatPromptTemplate.from_template(
    """
You are VelloreGPT, an expert travel assistant agent for Vellore city and its district. Your sole purpose is to help travelers with any questions about Vellore and places in and around Vellore district (including Yelagiri, Amirthi, Sripuram, etc.).

Strictly refuse to answer any question that is not about Vellore or its district. If a user asks about any other city, country, or topic not related to Vellore, politely respond that you only provide information about Vellore and its district for travelers.

Be friendly, concise, and always act as a local travel guide for Vellore. Do not answer questions outside this scope.

Use the following knowledge base for your answers:
{context}

Question: {question}
Answer as a Vellore travel assistant:
"""
)

llm = OllamaLLM(model="llama3")  # Change model name if you use a different Ollama model

# Load and index documents from the data/ folder
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
loader = TextLoader(os.path.join(DATA_DIR, "vellore_info.txt"))
docs = loader.load()

# Create embeddings and vector store
embeddings = OllamaEmbeddings(model="llama3")  # Use the same Ollama model for embeddings
vectorstore = FAISS.from_documents(docs, embeddings)
retriever = vectorstore.as_retriever()

# RAG chain: retrieve relevant context, then answer
rag_chain = (
    RunnableParallel({
        # Use the new .invoke method to avoid deprecation warning
        "context": lambda x: retriever.invoke(x["question"]),
        "question": lambda x: x["question"]
    })
    | prompt
    | llm
    | StrOutputParser()
)

def main():
    print("Welcome to the Vellore Travel Assistant (RAG)! Ask me anything about Vellore and its district.")
    last_vellore_question = None
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "bye", "see you later", "see you soon"]:
            print("Goodbye!")
            break
        # If the input is a follow-up (short or doesn't mention Vellore), prepend last Vellore question
        input_for_filter = user_input
        if last_vellore_question and (
            len(user_input.split()) <= 6 or not any(word in user_input.lower() for word in ["vellore", "yelagiri", "amirthi", "sripuram"])
        ):
            input_for_filter = f"{last_vellore_question} {user_input}"
        filtered = filter_query(input_for_filter)
        if filtered.startswith("Sorry, I can only answer questions about Vellore"):
            print(f"Assistant: {filtered}\n")
            continue
        if not isinstance(filtered, str):
            print("Assistant: Sorry, I can only answer questions about Vellore city and its district (including places like Yelagiri, Amirthi, Sripuram, etc.), or about how to travel to Vellore.\n")
            continue
        answer = rag_chain.invoke({"question": input_for_filter})
        print(f"Assistant: {answer}\n")
        # Only update last_vellore_question if the current input is a Vellore-related question
        if any(word in user_input.lower() for word in ["vellore", "yelagiri", "amirthi", "sripuram"]):
            last_vellore_question = user_input

if __name__ == "__main__":
    main()
