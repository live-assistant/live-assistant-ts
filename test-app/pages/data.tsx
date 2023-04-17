// MIT License

// Copyright (c) 2023 Live Assistant Authors

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

import {
  MousePositionPayload,
  KaraokeStationPayload,
  MediaInfoPayload,
  MessagePayload,
  SocketEventHandlerMap,
  MouseButtonPayload,
  KeyboardButtonPayload,
  GamepadPayload,
  AudiencePayload,
  EnterPayload,
  FollowPayload,
  InputAudioSpectrumPayload,
  OutputAudioSpectrumPayload,
  LiveAssistantClient,
  MediaPlaybackPayload,
} from '../../protocols/data/dist'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
} from 'react'

const ClientPage: NextPage = () => {
  const {
    query: {
      password = '',
    },
  } = useRouter()

  const [
    audience,
    setAudience,
  ] = useState<AudiencePayload | undefined>()

  const [
    interact,
    setInteract,
  ] = useState<EnterPayload | FollowPayload | undefined>()

  const [
    messages,
    setMessages,
  ] = useState<MessagePayload[]>([])

  const [
    heartRate,
    setHeartRate,
  ] = useState(0)

  const [
    mediaInfo,
    setMediaInfo,
  ] = useState<MediaInfoPayload | undefined>(undefined)

  const [
    mediaPlayback,
    setMediaPlayback,
  ] = useState<MediaPlaybackPayload | undefined>(undefined)

  const [
    inputAudio,
    setInputAudio,
  ] = useState<InputAudioSpectrumPayload>([])

  const [
    outputAudio,
    setOutputAudio,
  ] = useState<OutputAudioSpectrumPayload>([])

  const [
    karaoke,
    setKaraoke,
  ] = useState<KaraokeStationPayload | undefined>()

  const [
    mousePosition,
    setMousePosition,
  ] = useState<MousePositionPayload | undefined>()

  const [
    mouseButton,
    setMouseButton,
  ] = useState<MouseButtonPayload>({
    left: false,
    right: false,
    middle: false,
    four: false,
    five: false,
  })

  const [
    keyboard,
    setKeyboard,
  ] = useState<KeyboardButtonPayload>({} as KeyboardButtonPayload)

  const [
    gamepad,
    setGamepad,
  ] = useState<GamepadPayload>({} as GamepadPayload)

  const handlers = useMemo<SocketEventHandlerMap>(() => ({
    enter: e => setInteract(e),
    follow: f => setInteract(f),
    audienceUpdate: a => setAudience(a),
    message: m => setMessages(ms => [
      ...ms,
      m,
    ]),
    heartRate: h => setHeartRate(h.count),
    mediaInfo: m => setMediaInfo(m),
    mediaPlayback: m => setMediaPlayback(m),
    inputAudioSpectrum: a => setInputAudio(a),
    outputAudioSpectrum: a => setOutputAudio(a),
    karaokeStation: k => setKaraoke(k),
    mousePosition: p => setMousePosition(p),
    mouseButton: b => setMouseButton(button => ({
      ...button,
      ...b,
    })),
    keyboardButton: ({
      key,
      isDown,
    }) => setKeyboard(button => ({
      ...button,
      [key]: isDown,
    })),
    gamepad: g => setGamepad(g),
  }), [ ])

  const client = useMemo(() => new LiveAssistantClient(
    63472,
    password as string,
    handlers,
  ), [ password ])

  useEffect(() => {
    if (client.isStopped) {
      client.start()
    }

    return () => {
      if (!client.isStopped) {
        client.stop()
      }
    }
  }, [client])

  return (
    <>
    <img
      src={mediaInfo?.cover?.dataUrl}
    />

    <p>
      { JSON.stringify(mediaPlayback) }
    </p>

    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: `120px`,
        alignItems: 'flex-end',
      }}
    >
      {
        inputAudio.map((v, i) => <span
          key={`audio-in-${i}`}
          style={{
            width: `1px`,
            backgroundColor: 'red',
            height: `${v * 100}%`,
            minHeight: '1px',
          }}
        />)
      }
    </div>

    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: `120px`,
        alignItems: 'flex-end',
      }}
    >
      {
        outputAudio.map((v, i) => <span
          key={`audio-out-${i}`}
          style={{
            width: `1px`,
            backgroundColor: 'green',
            height: `${v * 100}%`,
            minHeight: '1px',
          }}
        />)
      }
    </div>

    <p>
      { `${mousePosition?.x ?? 0}, ${mousePosition?.y ?? 0}`}
    </p>

    <p>
      { JSON.stringify(mouseButton) }
    </p>

    <p>
      { JSON.stringify(keyboard) }
    </p>

    <p>
      { JSON.stringify(gamepad) }
    </p>

    <p>
      { JSON.stringify(karaoke) }
    </p>

    <p>
      { JSON.stringify(interact) }
    </p>

    <p>
      { JSON.stringify(audience) }
    </p>

    {
      messages.map(({
        content: {
          string,
        },
        sender,
      }, i) => <Fragment
        key={i}
      >
        <img
          src={audience?.avatar?.dataUrl ?? audience?.avatar?.url}
          width={32}
          height={32}
        />
        { string }
        <br/>
      </Fragment>)
    }
    </>
  )
}

export default ClientPage
