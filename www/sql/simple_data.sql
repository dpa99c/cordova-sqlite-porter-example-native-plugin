INSERT INTO Artist(Id,Title) VALUES ('6','Jane (inserted)');
INSERT OR REPLACE INTO Artist(Id,Title) VALUES ('1','Claire (replaced)');
UPDATE Artist SET Title='Susan (updated)' WHERE Id='2';
DELETE FROM Artist WHERE Id='5';