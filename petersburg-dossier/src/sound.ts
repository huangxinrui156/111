export class NightSound {
  private timer = 0
  private count = 0
  private master: GainNode
  tilt = 0
  constructor(private context: AudioContext) {
    this.master = context.createGain()
    this.master.gain.setValueAtTime(0, context.currentTime)
    this.master.gain.linearRampToValueAtTime(0.22, context.currentTime + 0.8)
    this.master.connect(context.destination)
    const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate)
    const data = buffer.getChannelData(0)
    let previous = 0
    for (let i = 0; i < data.length; i++) {
      previous = previous * 0.7 + (Math.random() * 2 - 1) * 0.3
      data[i] = previous
    }
    const noise = context.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    const filter = context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2300
    filter.Q.value = 0.65
    const rain = context.createGain()
    rain.gain.value = 0.23
    noise.connect(filter).connect(rain).connect(this.master)
    noise.start()
    this.beat()
  }
  private tone(hz: number, level: number, duration: number, delay = 0) {
    const oscillator = this.context.createOscillator()
    const envelope = this.context.createGain()
    const start = this.context.currentTime + delay
    oscillator.frequency.value = hz
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(level, start + 0.035)
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(envelope).connect(this.master)
    oscillator.start(start)
    oscillator.stop(start + duration)
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect() }
  }
  private beat = () => {
    this.tone(57, 0.13, 0.24)
    this.tone(49, 0.075, 0.26, 0.2)
    if (this.count++ % 13 === 0) {
      this.tone(146.83, 0.095, 3.1)
      this.tone(352, 0.023, 1.9)
    }
    this.timer = window.setTimeout(this.beat, 1150 + this.tilt * 15 - Math.abs(this.tilt) * 6)
  }
  stop() {
    clearTimeout(this.timer)
    const time = this.context.currentTime
    this.master.gain.cancelScheduledValues(time)
    this.master.gain.setTargetAtTime(0.0001, time, 0.038)
    window.setTimeout(() => { void this.context.close() }, 200)
  }
}
