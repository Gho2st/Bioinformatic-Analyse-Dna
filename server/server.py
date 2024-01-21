import io
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio.SeqUtils.ProtParam import ProteinAnalysis
from Bio.PDB import PDBParser
from Bio.PDB.Polypeptide import PPBuilder
from Bio.SeqUtils import MeltingTemp
from Bio import SeqIO
from Bio.SeqUtils import gc_fraction
import plotly.express as px
import plotly.graph_objects as go
import matplotlib
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import numpy as np
matplotlib.use('Agg')

app = Flask(__name__)
CORS(app, origins="*")

# Mapowanie liter aminokwasów na ich nazwy
amino_acid_mapping = {
    'A': 'Alanine',
    'C': 'Cysteine',
    'D': 'Aspartic Acid',
    'E': 'Glutamic Acid',
    'F': 'Phenylalanine',
    'G': 'Glycine',
    'H': 'Histidine',
    'I': 'Isoleucine',
    'K': 'Lysine',
    'L': 'Leucine',
    'M': 'Methionine',
    'N': 'Asparagine',
    'P': 'Proline',
    'Q': 'Glutamine',
    'R': 'Arginine',
    'S': 'Serine',
    'T': 'Threonine',
    'V': 'Valine',
    'W': 'Tryptophan',
    'Y': 'Tyrosine',
}

def plot_protein_sequence(protein_sequence):
    # Utwórz obiekt do przechowywania sekwencji białka
    seq_record = SeqRecord(Seq(protein_sequence), id="example_protein_sequence")

    # Utwórz wykres sekwencji białka
    plt.figure(figsize=(10, 0.5))
    plt.title("Protein Sequence")
    plt.bar(range(len(seq_record)), [1] * len(seq_record), color=['lightblue' if amino_acid in 'ACDEFGHIKLMNPQRSTVWY' else 'lightgreen' for amino_acid in seq_record.seq])
    plt.xticks(range(len(seq_record)), seq_record.seq)
    plt.yticks([])

    # Zapisz wykres do pamięci
    image_stream = BytesIO()
    plt.savefig(image_stream, format='png', bbox_inches='tight')
    image_stream.seek(0)

    # Przekonwertuj obraz na base64
    image_base64 = base64.b64encode(image_stream.read()).decode('utf-8')

    plt.close()  # Zamknij rysunek, aby zwolnić zasoby

    return image_base64

def plot_amino_acid_percentages(amino_acid_percentages):
    amino_acids = list(amino_acid_percentages.keys())
    percentages = list(amino_acid_percentages.values())

    plt.bar(amino_acids, percentages, color='skyblue')
    plt.xlabel('Amino Acids')
    plt.ylabel('Percentage (%)')
    plt.title('Amino Acid Percentages')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    # Zapisz wykres do pamięci
    image_stream = BytesIO()
    plt.savefig(image_stream, format='png')
    image_stream.seek(0)

    # Przekonwertuj obraz na base64
    image_base64 = base64.b64encode(image_stream.read()).decode('utf-8')

    plt.close()  # Zamknij rysunek, aby zwolnić zasoby

    return image_base64

def plot_dna_sequence(dna_sequence):
    seq_record = SeqRecord(dna_sequence, id="example_sequence")

    # Utwórz obiekt do przechowywania sekwencji DNA
    seq_records = [seq_record]

    # Utwórz wykres sekwencji DNA
    plt.figure(figsize=(10, 2))
    plt.title("DNA Sequence")
    plt.bar(range(len(seq_record)), [1] * len(seq_record), color=['lightblue' if base in 'AT' else 'lightgreen' for base in seq_record.seq])
    plt.xticks(range(len(seq_record)), seq_record.seq)
    plt.yticks([])

    # Zapisz wykres do pamięci
    image_stream = BytesIO()
    plt.savefig(image_stream, format='png', bbox_inches='tight')
    image_stream.seek(0)

    # Przekonwertuj obraz na base64
    image_base64 = base64.b64encode(image_stream.read()).decode('utf-8')

    plt.close()  # Zamknij rysunek, aby zwolnić zasoby

    return image_base64

def plot_gc_content(dna_sequence):
    gc_count = dna_sequence.count('G') + dna_sequence.count('C')
    at_count = dna_sequence.count('A') + dna_sequence.count('T')
    
    labels = ['GC Content', 'AT Content']
    sizes = [gc_count, at_count]
    colors = ['gold', 'lightskyblue']
    
    plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=140)
    plt.axis('equal')  

    # Zapisz wykres do pamięci
    image_stream = BytesIO()
    plt.savefig(image_stream, format='png')
    image_stream.seek(0)

    # Przekonwertuj obraz na base64
    image_base64 = base64.b64encode(image_stream.read()).decode('utf-8')

    plt.close()  # Zamknij rysunek, aby zwolnić zasoby

    return image_base64

@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify("hello world")

@app.route("/api/fasta", methods=['POST'])
def analyze_fasta():
    fasta_file = request.files.get('fasta_file')

    if not fasta_file:
        return {"error": "No FASTA file provided"}

    try:
        # Read the contents of the file
        fasta_content = fasta_file.read()

        # Zapisz plik FASTA na serwerze
        file_path = "uploads/fasta_file.fasta"  # Adjust the file name if needed
        with open(file_path, "wb") as file:
            file.write(fasta_content)

        print("Fasta zaladowany na serwerze")

        # Analiza pliku FASTA
        result = {
            "sequences": [],
            "summary": {}
        }

        with open(file_path, "r") as fasta_file:
            for record in SeqIO.parse(fasta_file, "fasta"):
                sequence_info = {
                    "name": record.id,
                    "length": len(record),
                    "gc_content": gc_fraction(record.seq) * 100
                }
                result["sequences"].append(sequence_info)

        result["summary"]["total_sequences"] = len(result["sequences"])
        result["summary"]["average_length"] = sum(seq["length"] for seq in result["sequences"]) / len(result["sequences"])
        result["summary"]["average_gc_content"] = sum(seq["gc_content"] for seq in result["sequences"]) / len(result["sequences"])

        # Usuń plik po analizie (opcjonalne)
        os.remove(file_path)

        return jsonify(result)

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
        
@app.route("/api/pdb", methods=['POST'])
def analyze_pdb():
    pdb_file = request.files.get('pdb_file')
    
    if pdb_file:
        pdb_content = pdb_file.read()
        
        print("plik odczytany")

        # Zapisanie zawartości do pliku o nazwie 'structure.pdb'
        with open('structure.pdb', 'wb') as pdb_output:
            pdb_output.write(pdb_content)

        parser = PDBParser()

        structure = parser.get_structure('structure', 'structure.pdb')

        header = structure.header
        protein_name = header.get('name', 'Brak informacji')
        resolution = header.get('resolution', "Brak informacji")
        
        num_chains = len(list(structure.get_chains()))
        num_residues = sum([len(list(chain.get_residues())) for chain in structure.get_chains()])
        num_models = len(structure)
        num_atoms = sum([len(list(model.get_atoms())) for model in structure])
        
        # Informacje o pierwszym łańcuchu i jego resztach
        first_chain = next(structure.get_chains(), None)
        if first_chain:
            first_chain_id = first_chain.id
            first_residue = next(first_chain.get_residues(), None)
            if first_residue:
                first_residue_name = first_residue.resname
            else:
                first_residue_name = 'Brak informacji'
        else:
            first_chain_id = 'Brak informacji'
            first_residue_name = 'Brak informacji'
            
            
        
        
        # Usunięcie pliku po analizie
        os.remove('structure.pdb')
        
        analysis_resultsPDB = {
            "name": protein_name,
            "resolution": resolution,
            "num_chains": num_chains,
            "num_residues": num_residues,
            "num_models": num_models,
            "num_atoms": num_atoms,
            "first_chain_id": first_chain_id,
            "first_residue_name": first_residue_name,
        }
        
        return jsonify(analysis_resultsPDB)
    

@app.route("/api/analyze_dna", methods=['POST'])
def analyze_dna():
    dna_sequence = Seq(request.form['dna_sequence'])
    
    if dna_sequence:
        print("plik odczytany")
        complement = str(dna_sequence.complement())
        reverse_complement = str(dna_sequence.reverse_complement())
        length = str(len(dna_sequence))
        at_content = str(dna_sequence.count('A') + dna_sequence.count('T'))
        gc_content = str(dna_sequence.count('G') + dna_sequence.count('C'))
        protein_sequence = str(dna_sequence.translate())
        protein_analysis = ProteinAnalysis(protein_sequence)
        amino_acid_percentages = protein_analysis.get_amino_acids_percent()
        amino_acid_names = {amino_acid_mapping[acid]: round(percentage, 3) for acid, percentage in amino_acid_percentages.items()}
        isoelectric_point = str(round(protein_analysis.isoelectric_point(),3))
        molecular_weight = str(round(protein_analysis.molecular_weight(),3))
        transcribt = str(dna_sequence.transcribe())
        melting_temp = MeltingTemp.Tm_Wallace(str(dna_sequence))
        

        dna_sequence_plot = plot_dna_sequence(dna_sequence)
        gc_plot = plot_gc_content(dna_sequence)
        amino_acid_plot = plot_amino_acid_percentages(amino_acid_percentages)
        protein_sequence_plot = plot_protein_sequence(protein_sequence)

        analysis_results = {
            'complement': complement,
            'reverse_complement': reverse_complement,
            'length': length,
            'at_content': at_content,
            'gc_content': gc_content,
            'protein_sequence': protein_sequence,
            'gc_plot': gc_plot,  # Dodaj wizualizację GC Content
            'amino_acid_percentages': amino_acid_names,
            'amino_acid_plot': amino_acid_plot,  # Dodaj wizualizację procentowego składu aminokwasów
            'dna_sequence_plot':dna_sequence_plot,
            'isoelectric_point':isoelectric_point,
            'molecular_weight':molecular_weight,
            'protein_sequence_plot':protein_sequence_plot,
            'transcribt': transcribt,
            'melting_temp':melting_temp,
        }
        return jsonify(analysis_results)

        
    

if __name__ == "__main__":
    app.run(debug=True, port=8080)
