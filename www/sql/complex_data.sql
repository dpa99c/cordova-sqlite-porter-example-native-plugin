INSERT INTO [Album] ([AlbumId], [Title], [ArtistId]) VALUES (348, 'An inserted album by Philip Glass Ensemble', 275);
INSERT OR REPLACE INTO [Album] ([AlbumId], [Title], [ArtistId]) VALUES (347, 'A replaced album by Philip Glass Ensemble', 275);
UPDATE Album SET Title='Mozart: Chamber Music (updated)' WHERE AlbumId='346';
DELETE FROM Track WHERE AlbumId="345";