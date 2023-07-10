-- Exploratory Queries

-- 1. Check for null id values in the main "Series" table. If there are none, it should return nothing.
Select
*
from series
where id is null


-- 2. Return the number of movies/series by genre, ordered from greatest to least. A movie/series can appear in multiple genres.
Select
genres.name
,count(distinct series_genre.series_id) as series_cnt
from series_genre
join genres on series_genre.genre_id = genres.id
group by 1
order by 2 desc


-- 3. Return the number of movies by director count.
with subquery as (
    
    Select
    series_id
    ,count(distinct director_id) as director_cnt
    from series_directors
    group by 1
)

Select
director_cnt
,count(distinct series_id) as series_cnt
from subquery
group by 1
order by 2 desc


-- 4. Return the total number of movies and series between 2010 and 2020
Select
series_type
,count(distinct id) as series_cnt
from series
where release_year between 2010 and 2020
group by 1




-- Queries related to the final project

-- 1. What genre of movie/series have the highest ratings on average over the past 5 years? (return the top 5) Objective is to recommend highly rated genres.
Select
genres.name
,avg(rating) as avg_rating
from series
join series_genre on series.id = series_genre.series_id
join genres on series_genre.genre_id = genres.id
where release_year between 2018 and 2023
group by 1
order by 2 desc
LIMIT 5


-- 2. Does a movie/series certification (R, PG-13, etc.) impact its rating? Objective is to determine if higher rated media tends to skew towards a certain certification.
Select
series_type
,certificate
,avg(rating) as avg_rating
from series
group by 1,2
order by 3 desc



-- 3. What genres have the largest rating difference between movies and tv shows over the last 5 years? (return the top 5 largest differences) Objective is to determine whether movies or shows are generally higher rated in a particular genre.
with subquery as (
    
    Select
    genres.name
    ,avg(case when series.series_type = 'movie' then series.rating end) as avg_movie_rating
    ,avg(case when series.series_type = 'series' then series.rating end) as avg_series_rating
    from series
    join series_genre on series.id = series_genre.series_id
    join genres on series_genre.genre_id = genres.id
    where release_year between 2018 and 2023
    group by 1
)

Select
*
,abs(avg_movie_rating - avg_series_rating) as movie_series_rating_difference
from subquery
order by 4 desc
LIMIT 5


-- 4. What actors have appears in the worst rated movies/shows (minimum of 5 appearances)? Objective is to avoid recommending movies/shows with poorly rated actors.

with appearances as (
    
    Select
    actor_id
    ,count(distinct series_id) as series_cnt
    from series_actors
	group by 1
    having count(distinct series_id) >= 5

)

Select
actors.name
,avg(series.rating) as avg_rating
from series_actors
join appearances on series_actors.actor_id = appearances.actor_id
join actors on appearances.actor_id = actors.id
join series on series_actors.series_id = series.id
group by 1
order by 2 asc
LIMIT 5


-- 5. What actor/director combination has the highest average rating every year between 2020 and 2023? Objective is to identify highly rated actor/director combinations for future recommendations.

with subquery as (
    
    Select
    actors.name as actor_name
    ,directors.name as director_name
    ,count(distinct series.id) as series_cnt
    ,avg(series.rating) as avg_combo_rating
    from series
    join series_directors on series.id = series_directors.series_id
    join directors on series_directors.director_id = directors.id
    join series_actors on series.id = series_actors.series_id
    join actors on series_actors.actor_id = actors.id
    where series.series_type = 'movie'
    and series.release_year between 2020 and 2023
    group by 1,2
)

Select
director_name
,actor_name
,avg_combo_rating
from subquery
where series_cnt >= 3
order by avg_combo_rating desc
LIMIT 3


