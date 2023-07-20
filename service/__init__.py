from flask import Flask, g, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db():
    if 'db' not in g:
        g.db = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASS'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )
    return g.db

@app.teardown_appcontext
def close_db(error):
    if 'db' in g:
        g.db.close()

@app.route('/test')
def service_check():
    return "movie service is up!"

@app.route('/tables')
def table_check():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';")
    rows = cursor.fetchall()
    return str(rows)

@app.route('/series', methods=['GET'])
def get_series():
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=20, type=int)
    offset = (page - 1) * limit

    query = """
    SELECT 
        series.id AS series_id,
        series.name AS series_name,
        series.release_year,
        series.rating,
        series.certificate,
        series.vote_count,
        series.series_type,
        genres.name AS genre_name,
        directors.name AS director_name,
        actors.name AS actor_name
    FROM 
        series
    LEFT JOIN 
        series_genre ON series.id = series_genre.series_id
    LEFT JOIN 
        genres ON series_genre.genre_id = genres.id
    LEFT JOIN 
        series_directors ON series.id = series_directors.series_id
    LEFT JOIN 
        directors ON series_directors.director_id = directors.id
    LEFT JOIN 
        series_actors ON series.id = series_actors.series_id
    LEFT JOIN 
        actors ON series_actors.actor_id = actors.id
    ORDER BY
        series.id
    LIMIT %s OFFSET %s;
    """
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query, (limit, offset))
    records = cursor.fetchall()
    return jsonify(records)


@app.route('/search', methods=['GET'])
def search():
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=20, type=int)
    offset = (page - 1) * limit
    search_type = request.args.get('type', default=None, type=str)
    search_term = request.args.get('term', default=None, type=str)

    # Check if search_type and search_term are provided
    if not search_type or not search_term:
        return jsonify({'error': 'Search type and term are required.'}), 400

    if search_type.lower() not in ['genre', 'director', 'series', 'actor']:
        return jsonify({'error': 'Invalid search type.'}), 400

    # Create the base query
    query = """
    SELECT 
        series.id AS series_id,
        series.name AS series_name,
        series.release_year,
        series.rating,
        series.certificate,
        series.vote_count,
        series.series_type,
        genres.name AS genre_name,
        directors.name AS director_name,
        actors.name AS actor_name
    FROM 
        series
    LEFT JOIN 
        series_genre ON series.id = series_genre.series_id
    LEFT JOIN 
        genres ON series_genre.genre_id = genres.id
    LEFT JOIN 
        series_directors ON series.id = series_directors.series_id
    LEFT JOIN 
        directors ON series_directors.director_id = directors.id
    LEFT JOIN 
        series_actors ON series.id = series_actors.series_id
    LEFT JOIN 
        actors ON series_actors.actor_id = actors.id
    """

    # Add the WHERE clause based on the search type
    if search_type.lower() == 'series':
        query += " WHERE series.name ILIKE %s"
    elif search_type.lower() == 'genre':
        query += " WHERE genres.name ILIKE %s"
    elif search_type.lower() == 'director':
        query += " WHERE directors.name ILIKE %s"
    elif search_type.lower() == 'actor':
        query += " WHERE actors.name ILIKE %s"

    # Add the order and pagination
    query += """
    ORDER BY
        series.id
    LIMIT %s OFFSET %s;
    """

    # Search term is wrapped with '%' for partial matching
    search_term = '%' + search_term + '%'
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query, (search_term, limit, offset))
    records = cursor.fetchall()

    return jsonify(records)
