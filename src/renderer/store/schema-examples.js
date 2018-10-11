/* The relationship between a video item and its episode is one to one,
 * The relationship between a video item episode and its subtitles is one to few.
 * So for media type of video, the episode and subtitles should be embeded.
 * 
 * And also, since subtitles always need the context of parent object. So
 * subtitles should be embeded in episodes always.
 * 
 * For subtitle insertion and deletion, ['mediaType', 'mediaId'] or ['episodeId'] should be present.
 * 'mediaType' should be 'video', or 'movie'. By checking the existence of 'mediaType',
 * one can be sure where the subtitle is from.
 * There generally should not be any update operation on subtitles.
 * 
 * For media type of 'folder', all episodes are read from file system, and they
 * are not stored in database. For episodes that have subtitles included, since
 * the amount would be a few to hundreds, they should be stored separately, with
 * parent media object storing all episode ids.
 * 
 * For media type of 'movie', only a couple of episodes are expected, that is
 * when the movie is separated into several files. So episodes should be embeded.
 * 
 * For media type of 'tvshow', hundreds of episodes are expected, so they should
 * be stored separately, with parent media object storing all episode ids.
 * 
 * For recent media:
 *   There should only be media items. Clicking on the media item either plays
 *   the episode watching, or the next episode if the previous episode is done.
 *   So media item should have an 'recentEpisode' field. For 'video' media,
 *   'recentEpisodeId' should be it id self, if the progress is 'done', then it
 *   should not be included in recent media.
 * 
 * For favorite media:
 *   There can be media and episodes at the same time. Clicking on the media item shows
 *   a list of favorited episodes for media type of 'folder', 'movie' and 'tvshow'.
 *   The media parent is favorited manually, or automatically if there are episodes
 *   belonging to it get favorited. For 'video' media, 'favorite' can be a Boolean, for
 *   'folder', 'movie', and 'tvshow' media, media 'favorite' field should be a non negative
 *   integer, and favoriting an episode from a media should increase parent media's 'favorite'
 *   field, vice versa.
 * 
 * (1) Runtime and progress:
 *   double number of seconds.
 */

const _id1 = Date.now().toString() + '1'
const _id2 = Date.now().toString() + '2'
const _id3 = Date.now().toString() + '3'

const videoItem = {
  _id: _id1,
  mediaType: 'video', // mediaData
  title: 'A Very Interesting Video',
  backdropPath: '/a/b/c/d.jpg', // Make this '_id' + '.png', (1)
  filePath: 'a/b/c/d.mp4', // mediaData
  favorite: true, // When this field doesn't exist, it's false by default
  private: false, // Same as above
  runtime: Math.random() * 120 * 60 * 60 * 1000, // (1)
  progress: 0.3333 * 120 * 60 * 60 * 1000, // 0 if non exist
  lastWatched: new Date(), // 0 if non exist
  recentEpisodeId: _id1, // null if non exist
  defaultSubtitleId: _id2, // null if non exist
  subtitles: [
    {
      _id: _id2,
      label: 'English', // required
      lang: 'en', // required
      filePath: 'a/b/c/d.srt', // required
    },
    {
      _id: _id3,
      label: 'English',
      lang: 'en',
      filePath: 'a/b/c/d.vtt',
    },
  ], // [] if non exist
  createdAt: new Date(), // This field is generated by database, required
}

const _id4 = Date.now().toString() + '4'
const _id5 = Date.now().toString() + '5'
const _id6 = Date.now().toString() + '6'
const _id7 = Date.now().toString() + '7'
const _id8 = Date.now().toString() + '8'

const movieItem = {
  _id: _id4,
  mediaType: 'movie',
  createdAt: new Date(),
  title: 'A Very Interesting Movie',
  overview: 'Really funny movie',
  posterPath: 'a/b/c/d.jpg',
  favorite: 1,
  private: true,
  runtime: Math.random() * 120 * 60 * 60 * 1000,
  recentEpisodeId: _id6,
  episodes: [
    {
      _id: _id5,
      title: 'part1',
      filePath: 'a/b/c/1.mp4',
      backdropPath: 'a/b/c/d.jpg',
      favorite: true,
      history: null,
    },
    {
      _id: _id6,
      title: 'part1',
      filePath: 'a/b/c/1.mp4',
      backdropPath: 'a/b/c/d.jpg',
      progress: 0.3333 * 120 * 60 * 60 * 1000,
      lastWatched: new Date(),
      defaultSubtitleId: _id8,
      subtitles: [
        {
          _id: _id7,
          title: 'English',
          lang: 'en',
          filePath: 'a/b/c/d.srt',
        },
        {
          _id: _id8,
          title: 'English',
          lang: 'en',
          filePath: 'a/b/c/d.vtt',
        },
      ],
    },
  ],
}

const _id9 = Date.now().toString() + '9'
const _id10 = Date.now().toString() + '10'
const _id11 = Date.now().toString() + '11'
const _id12 = Date.now().toString() + '12'
const _id13 = Date.now().toString() + '13'
const _id14 = Date.now().toString() + '14'
const _id15 = Date.now().toString() + '15'

const folderItem = {
  _id: _id9,
  mediaType: 'folder',
  createdAt: new Date(),
  title: 'A Folder Full of Funny Things',
  backdropPath: 'a/b/c/d.jpg',
  filePath: 'a/b/c',
  favorite: true,
  private: false,
  recentEpisodeId: _id11,
}

const tvshowItem = {
  _id: _id10,
  mediaType: 'tvshow',
  createdAt: new Date(),
  title: 'A Funny TV Show',
  overview: 'A really funny show',
  posterPath: 'a/b/c/d.jpg',
  favorite: false,
  private: true,
  recentEpisodeId: _id12,
}

const episodes = [
  {
    _id: _id11,
    title: 'Episode 11',
    overview: 'Folder episode 11',
    backdropPath: 'a/b/c/d.jpg',
    filePath: 'a/b/c/d.mp4',
    favorite: true,
    defaultSubtitleId: _id15,
    subtitles: [
      {
        _id: _id13,
        label: 'English',
        lang: 'en',
        filePath: 'a/b/c/d.srt',
      },
      {
        _id: _id14,
        label: 'English',
        lang: 'en',
        filePath: 'a/b/c/d.vtt',
      },
    ],
  },
  {
    _id: _id12,
    title: 'Episode 12',
    overview: 'TV Show episode 12',
    backdropPath: 'a/b/c/d.jpg',
    filePath: 'a/b/c/d.mp4',
    seasonNumber: 1,
    episodeNumber: 12,
    favorite: false,
    defaultSubtitleId: _id15,
    subtitles: [
      {
        _id: _id15,
        label: 'English',
        lang: 'en',
        filePath: 'a/b/c/d.srt',
      },
    ],
  },
]
