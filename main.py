import spotipy
import spotipy.util as util
import time as t

scope = 'user-read-currently-playing'
user = ''
client = ''
secret = ''
redirect = 'http://localhost:8888/callback'

token = util.prompt_for_user_token(user, scope, client, secret, redirect)

s = spotipy.Spotify(auth=token)

last_name = 0
last_ts = 0
last_state = 0

while True:
    t.sleep(1)

    try:
        track = s.current_user_playing_track()
        name = track['item']['name']

        artists = ''
        noArtists = len(track['item']['artists'])
        x=1
        for artist in track['item']['artists']:
            if x == noArtists:
                artists += artist['name']
            else:
                artists += artist['name'] + ', '
            x += 1

        state = s.current_playback()['is_playing']
        ts = track['progress_ms']
        duration = track['item']['duration_ms']
        img_width = track['item']['album']['images'][0]['width']
        img_height = track['item']['album']['images'][0]['height']
        img_url = track['item']['album']['images'][0]['url']


        if (ts - last_ts > 2000) or (name != last_name) or (state != last_state):
            print('Sending new track...')
            msg = name + "_" + artists + '_' + str(duration) + '_' + str(ts) + '_' + str(state) + '_' + str(img_width) + '_' + str(img_height) + '_' + str(img_url)
            f = open("song.csv", "w")
            f.write(msg)
            f.close()
            print(msg)
            last_ts = ts
            last_name = name
            last_state = state
        else:
            last_ts = ts
    except:
        print('No song playing.')
        t.sleep(5)
