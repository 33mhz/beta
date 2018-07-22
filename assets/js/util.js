import _ from 'lodash'

export function getTitle({ username, name }) {
  return name ? `${name}(@${username})` : `@${username}`
}

export function getImageURLs(post, rawOnly = false) {
  if (!post.content) return []
  const imgExt = /\.(png|gif|jpe?g|bmp|svg)$/
  const photos = []
  if (!rawOnly) {
    const linkPhotos = post.content.entities.links
      .filter(link => imgExt.test(link.link))
      .map(link => {
        return {
          original: link.link,
          thumb: link.link
        }
      })
    Array.prototype.push.apply(photos, linkPhotos)
  }
  if (post.raw) {
    const embedPhotos = post.raw
      .filter(r => {
        return r.type === 'io.pnut.core.oembed' && r.value.type === 'photo'
      })
      .map(r => {
        return {
          ...r.value,
          original: r.value.url,
          thumb: r.value.url
        }
      })
    Array.prototype.push.apply(photos, embedPhotos)
  }
  return _.uniqBy(photos, 'original')
}

export function getCrosspostLink(post) {
  if (!post.content || !post.raw) return false
  const canonical_link = post.raw.find(r => {
    return r.type === 'io.pnut.core.crosspost'
  })
  if (canonical_link) {
    return canonical_link.value.canonical_url
  }
}

export function getSpoilers(post) {
  if (!post.content) return []
  const spoilers = []
  if (post.raw) {
    const spoiler = post.raw
      .filter(r => {
        return (
          r.type === 'shawn.spoiler' &&
          r.value.topic &&
          (!r.value.expired_at || new Date(r.value.expired_at) > new Date())
        )
      })
      .map(r => {
        return {
          topic: r.value.topic
        }
      })
    Array.prototype.push.apply(spoilers, spoiler)
  }
  return spoilers
}

export function getLongpost(post) {
  if (!post.content) return []
  if (!post.raw) return []
  const longposts = []
  const longpost = post.raw
    .filter(r => {
      return r.type === 'nl.chimpnut.blog.post' && r.value.body
    })
    .map(r => {
      return {
        body: r.value.body,
        title:
          r.value.title &&
          r.value.title != r.value.body.substr(0, r.value.title.length)
            ? r.value.title
            : false
      }
    })
  Array.prototype.push.apply(longposts, longpost)
  return longpost[0]
}
