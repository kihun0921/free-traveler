-- Seed data for local development and QA
-- Sample user profiles
INSERT INTO
  user_profile (
    id,
    email,
    nickname,
    is_adult,
    adult_verified_at,
    age_group,
    gender,
    travel_style,
    status
  )
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'alice@example.test',
    'AliceTraveler',
    true,
    now(),
    '25-34',
    'female',
    'adventure',
    'active'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'bob@example.test',
    'BobExplorer',
    true,
    now(),
    '35-44',
    'male',
    'relaxation',
    'active'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'carol@example.test',
    'CarolWanderer',
    true,
    now(),
    '25-34',
    'female',
    'cultural',
    'active'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'david@example.test',
    'DavidJourneyer',
    true,
    now(),
    '45-54',
    'male',
    'adventure',
    'active'
  );

-- Sample mate posts (mix of future and past dates for status testing)
INSERT INTO
  mate_post (
    id,
    user_id,
    title,
    country,
    region,
    start_date,
    end_date,
    people_count,
    conditions,
    description,
    status,
    safety_agreed_at,
    policy_version
  )
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Japan Cherry Blossom Tour',
    'Japan',
    'Kanto',
    '2025-04-01',
    '2025-04-15',
    2,
    'English speaker preferred',
    'Looking for travel buddy for cherry blossom season in Tokyo. Budget-friendly backpacking style.',
    'OPEN',
    now(),
    'v1.0'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'Vietnam North to South Backpack',
    'Vietnam',
    'Multiple',
    '2025-05-10',
    '2025-06-10',
    3,
    'Flexible itinerary, budget conscious',
    'Epic Vietnam journey covering Hanoi, Ha Long Bay, Hoi An, and Saigon. First-timers welcome!',
    'OPEN',
    now(),
    'v1.0'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    'Korea Culture & Food Tour',
    'South Korea',
    'Seoul',
    '2025-03-20',
    '2025-03-27',
    2,
    'Interest in Korean culture and cuisine',
    'Week-long cultural immersion in Seoul. Museum visits, temple stays, cooking classes, and street food exploration.',
    'OPEN',
    now(),
    'v1.0'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '44444444-4444-4444-4444-444444444444',
    'Thailand Island Hopping',
    'Thailand',
    'Southern Thailand',
    '2025-02-01',
    '2025-02-28',
    4,
    'Beach lovers welcome',
    'Island hopping adventure across Phuket, Krabi, and Phi Phi islands. Diving and snorkeling included.',
    'OPEN',
    now(),
    'v1.0'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    'Taiwan Mountain Trek',
    'Taiwan',
    'Mountain regions',
    '2024-11-15',
    '2024-11-22',
    2,
    'Hiking experience required',
    'Challenging mountain trek through Taiwan highlands. Early morning starts and high altitude camping.',
    'OPEN',
    now(),
    'v1.0'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '22222222-2222-2222-2222-222222222222',
    'Malaysia City & Nature Mix',
    'Malaysia',
    'Kuala Lumpur',
    '2025-07-15',
    '2025-07-22',
    3,
    'Open-minded, flexible schedule',
    'Urban exploration in KL combined with rainforest visits. Budget accommodation and local transport.',
    'OPEN',
    now(),
    'v1.0'
  );

-- Sample mate applications
INSERT INTO
  mate_application (id, post_id, user_id, message, status)
VALUES
  (
    '10101010-1010-1010-1010-101010101010',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'I am very interested in this trip! I have experience traveling in Japan and speak some Japanese.',
    'PENDING'
  ),
  (
    '20202020-2020-2020-2020-202020202020',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '33333333-3333-3333-3333-333333333333',
    'This sounds amazing! I am a solo traveler looking for a group. Very flexible with dates.',
    'PENDING'
  );
