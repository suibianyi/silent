import { getDomain } from '@/api/MFS/mfs'

const domainCache = {}

export async function getQnDomain(bucket = 'mps') {
  const cache = domainCache[bucket]
  if (cache) {
    return cache
  }
  const data = await getDomain({ bucket })
  const domain = data.domain
  domainCache[bucket] = domain
  return domain
}

export function getHost() {
  const { location } = window
  return `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`
}

const supportWebp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
const defaultFormat = supportWebp ? 'webp' : 'jpg'

export async function qnImage(url, format = defaultFormat, bucket, w = 0, h = 0) {
  if (url && url.indexOf('/') >= 0) {
    return url
  }
  const domain = await getQnDomain(bucket)
  return `${domain}/${url}`
}
