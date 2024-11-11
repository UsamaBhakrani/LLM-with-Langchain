from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.chains import sequential

import argparse

load_dotenv()

parser = argparse.ArgumentParser()
parser.add_argument('--task', default='return a list of numbers')
parser.add_argument('--language', default='python')
args = parser.parse_args()

llm = ChatOpenAI()


code_prompt = ChatPromptTemplate.from_messages([
    ('user',
     'Write a code snippet in {language} that will {task}')
])

test_prompt = ChatPromptTemplate.from_messages(
    ['user', 'Write a a test for the following {language} code:\n{code}']
)

code_chain = (code_prompt | llm)
test_chain = (test_prompt | llm)

chain = code_chain | test_chain

result = chain.invoke(
    {'language': args.language, 'task': args.task})


print(result)
