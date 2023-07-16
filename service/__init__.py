from flask import Flask, g, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
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
