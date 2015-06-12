INSERT INTO Album(AlbumId,Title) VALUES ('6','Jane (inserted)');
INSERT OR REPLACE INTO Album(AlbumId,Title) VALUES ('1','Claire (replaced)');
UPDATE Album SET Title='Susan (updated)' WHERE AlbumId='2';
DELETE FROM Album WHERE AlbumId='5';