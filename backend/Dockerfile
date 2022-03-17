FROM continuumio/miniconda3:4.9.2

ENV FLASK_APP=flask_master_app.py

# Flask app
COPY flask_master_app.py .
COPY trie_construction.py .
COPY suffixArray.py .
COPY suffixArrayMultiple.py .
COPY BWT.py .
# Python Libraries
COPY requirements.txt .

RUN pip install -r requirements.txt --ignore-installed ruamel.yaml

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
