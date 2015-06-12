DROP TABLE IF EXISTS Album;
CREATE TABLE Album ([AlbumId] PRIMARY KEY, [Title]);
CREATE UNIQUE INDEX Album_ID ON Album(AlbumId);
INSERT OR REPLACE INTO Album(AlbumId,Title) VALUES ('1','Fred');
INSERT OR REPLACE INTO Album(AlbumId,Title) VALUES ('2','Bob');
INSERT OR REPLACE INTO Album(AlbumId,Title) VALUES ('3','Tom');
INSERT OR REPLACE INTO Album(AlbumId,Title) VALUES ('4','Dick');
INSERT OR REPLACE INTO Album(AlbumId,Title) VALUES ('5','Harry');