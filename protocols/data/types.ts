// MIT License

// Copyright (c) 2023 @live-assistant/protocols-data's Authors

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export type DataType = keyof DataTypeToPayloadMap

export type SocketDataPayload = {
  type: DataType
  payload: DataTypeToPayloadMap[DataType]
}

export type StringContentPayload = {
  string: string
  language?: string
  pronunciation?: string
  translation?: string
  translationLanguage?: string
}

export type ImageContentPayload = {
  url: string
  dataUrl?: string
}

export type BadgePayload = {
  displayName?: StringContentPayload
  level: number
  image?: ImageContentPayload
  color?: string
}

export type AudiencePayload = {
  id: string
  username?: StringContentPayload
  avatar?: ImageContentPayload
  level: number
  badges: BadgePayload[]
  isModerator: boolean
  isMember: boolean
}

export type SkuPayload = {
  id: string
  displayName: StringContentPayload
  image?: ImageContentPayload
  amount: number
  currency: string
  level: number
}

export type EmotePayload = {
  id: string
  keyword: string
  image: ImageContentPayload
}

export type EnterPayload = {
  timestamp: number
  audience: AudiencePayload
}

export type FollowPayload = {
  timestamp: number
  audience: AudiencePayload
}

export type MessagePayload = {
  id: string
  timestamp: number
  sender?: AudiencePayload
  content: StringContentPayload
  color?: string
  emotes: EmotePayload[]
}

export type SuperChatPayload = {
  id: string
  timestamp: number
  sender?: AudiencePayload
  sku: SkuPayload
  content: StringContentPayload
  color?: string
  emotes: EmotePayload[]
  start: number
  end: number
}

export type GiftPayload = {
  id: string
  timestamp: number
  sender?: AudiencePayload
  sku: SkuPayload
  count: number
  note?: StringContentPayload
}

export type MembershipPayload = {
  id: string
  timestamp: number
  sender?: AudiencePayload
  sku: SkuPayload
  count: number
  start: number
  end: number
}

export type ViewersCountPayload = {
  timestamp: number
  count: number
}

export type CaptionPayload = {
  start: number
  end: number
  content: StringContentPayload
}

export type HeartRatePayload = {
  timestamp: number
  count: number
}

export type MediaType =
  | 'image'
  | 'music'
  | 'unknown'
  | 'video'

export type MediaPlaybackStatus =
  | 'changing'
  | 'closed'
  | 'opened'
  | 'paused'
  | 'playing'
  | 'stopped'

export type MediaPlaybackRepeatMode =
  | 'list'
  | 'none'
  | 'track'

export type MediaInfoPayload = {
  type: MediaType
  title: string
  album: string
  cover?: ImageContentPayload
  trackCount: number
  trackNumber: number
  artist: string
  genres: string[]
  status: MediaPlaybackStatus
  repeatMode: MediaPlaybackRepeatMode
  shuffle: boolean
  rate: number
  duration: number
  position: number
}

export type InputAudioSpectrumPayload = number[]

export type OutputAudioSpectrumPayload = number[]

export type KaraokeStationItemPayload = {
  name: string
  audience?: AudiencePayload
}

export type KaraokeStationPayload = {
  triggerKeyword: string
  minimumInterval: number
  minimumAudienceLevel: number
  requiresWearingBadge: boolean
  list: KaraokeStationItemPayload[]
}

export type MousePositionPayload = {
  x: number
  y: number
}

export type MouseButtonPayload = Partial<{
  left?: boolean
  middle?: boolean
  right?: boolean
  four?: boolean
  five?: boolean
}>

export type KeyboardButtonPayload = {
  key: string
  isDown?: boolean
}

export type GamepadPayload = {
  leftX: number
  leftY: number
  rightX: number
  rightY: number
  leftTrigger: number
  rightTrigger: number
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  leftThumbstick: boolean
  rightThumbstick: boolean
  leftShoulder: boolean
  rightShoulder: boolean
  north: boolean
  south: boolean
  east: boolean
  west: boolean
  home: boolean
  utilLeft: boolean
  utilRight: boolean
}

export type DataTypeToPayloadMap = {
  enter: EnterPayload
  follow: FollowPayload
  audienceUpdate: AudiencePayload
  message: MessagePayload
  superChat: SuperChatPayload
  gift: GiftPayload
  membership: MembershipPayload
  viewersCount: ViewersCountPayload
  caption: CaptionPayload
  heartRate: HeartRatePayload
  mediaInfo: MediaInfoPayload
  inputAudioSpectrum: InputAudioSpectrumPayload
  outputAudioSpectrum: OutputAudioSpectrumPayload
  karaokeStation: KaraokeStationPayload
  mousePosition: MousePositionPayload
  mouseButton: MouseButtonPayload
  keyboardButton: KeyboardButtonPayload
  gamepad: GamepadPayload
}

export type SocketEventHandlerMap = Partial<{
  [E in keyof DataTypeToPayloadMap]: (payload: DataTypeToPayloadMap[E]) => void
} & {
  open: (e: Event) => void
  close: (e: CloseEvent) => void
  error: (e: Event) => void
}>
