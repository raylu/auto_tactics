/* eslint-disable camelcase */

import type {SoundConfig} from '@excaliburjs/plugin-jsfxr';
import {Sound} from 'excalibur';
import {loader} from './loader';

export const sounds: {[key: string]: SoundConfig} = {
	'hit': {
		oldParams: true,
		wave_type: 3,
		p_env_attack: 0.162,
		p_env_sustain: 0.023762675686034476,
		p_env_punch: 0.302,
		p_env_decay: 0.255,
		p_base_freq: 0.284,
		p_freq_limit: 0,
		p_freq_ramp: -0.42168049066005564,
		p_freq_dramp: 0,
		p_vib_strength: 0,
		p_vib_speed: 0,
		p_arp_mod: 0,
		p_arp_speed: 0,
		p_duty: 1,
		p_duty_ramp: 0,
		p_repeat_speed: 0,
		p_pha_offset: 0,
		p_pha_ramp: 0,
		p_lpf_freq: 1,
		p_lpf_ramp: 0,
		p_lpf_resonance: 0,
		p_hpf_freq: 0,
		p_hpf_ramp: 0,
		sound_vol: 0.25,
		sample_rate: 44100,
		sample_size: 8,
	},
} as const;

export const iceSound = new Sound('static/audio/ice.m4a');

loader.addResource(iceSound);
