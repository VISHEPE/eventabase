CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  date DATE
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT,
  user_id INT,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE events
ADD COLUMN location VARCHAR(255) NULL,
ADD COLUMN category VARCHAR(100) NULL;


INSERT INTO events (title, description, date, location, category)
VALUES
  ('Tech Conference 2024', 'A conference on the latest tech innovations.', '2024-05-15', 'Nairobi, Kenya', 'Technology'),
  ('Music Festival', 'A huge music festival featuring top artists.', '2024-06-20', 'Mombasa, Kenya', 'Music'),
  ('Startup Pitch Competition', 'A competition where startups pitch their ideas to investors.', '2024-07-10', 'Kisumu, Kenya', 'Business'),
  ('Food Expo', 'An expo showcasing the latest food trends and innovations.', '2024-08-05', 'Nakuru, Kenya', 'Food'),
  ('Fitness Workshop', 'A workshop on fitness and wellness.', '2024-09-25', 'Eldoret, Kenya', 'Health'),
  ('Art Exhibition', 'An exhibition featuring contemporary art pieces.', '2024-10-12', 'Nairobi, Kenya', 'Art'),
  ('Digital Marketing Bootcamp', 'A bootcamp to learn digital marketing strategies.', '2024-11-07', 'Kisumu, Kenya', 'Education'),
  ('Gaming Tournament', 'An online gaming tournament with various game categories.', '2024-12-01', 'Virtual Event', 'Gaming'),
  ('Job Fair 2024', 'A job fair where job seekers meet recruiters from top companies.', '2024-06-05', 'Nairobi, Kenya', 'Career'),
  ('Charity Auction', 'An auction event where all proceeds go to charity.', '2024-04-15', 'Nakuru, Kenya', 'Charity');



