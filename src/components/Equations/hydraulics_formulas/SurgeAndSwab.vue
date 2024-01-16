<script setup>
import store from '@/store'
import {ref, computed } from 'vue'

// Data
const n = ref('')
const K = ref('')
const dc_od = ref('')
const dc_id = ref('')
const dc_length = ref('')
const pipe_speed = ref('')
const tvd = ref('')

// Pipe Type
const openEnded = ref(true)
const closeEnded = ref(false)

// Select Type
const openEndedPipe = () => {
    openEnded.value = true
    closeEnded.value = false
}

const closeEndedPipe = () => {
    openEnded.value = false
    closeEnded.value = true
}

// Units
const dcODUnit = ref('inch')
const dcIDUnit = ref('inch')
const dcLengthUnit = ref('ft')
const pipeSpeedUnit = ref('ft/min')
const tvdUnit = ref('ft')
const surgeUnit = ref('psi')
const swabUnit = ref('psi')

// Conversions
const dcODConv = computed(() => {
    if (dcODUnit.value == 'inch') {
        dc_od.value = (dc_od.value / 1000 * 3.281 * 12).toFixed(3)
    } else {
        dc_od.value = (dc_od.value * 1000 / 3.281 / 12).toFixed(0)
    }
})

const dcIDConv = computed(() => {
    if (dcIDUnit.value == 'inch') {
        dc_id.value = (dc_id.value / 1000 * 3.281 * 12).toFixed(3)
    } else {
        dc_id.value = (dc_id.value * 1000 / 3.281 / 12).toFixed(0)
    }
})

const dcLengthConv = computed(() => {
    if (dcLengthUnit.value == 'ft') {
        dc_length.value = (dc_length.value * 3.281).toFixed(0)
    } else {
        dc_length.value = (dc_length.value / 3.281).toFixed(0)
    }
})

const pipeSpeedConv = computed(() => {
    if (pipeSpeedUnit.value == 'ft/min') {
        pipe_speed.value = (pipe_speed.value * 3.281).toFixed(2)
    } else {
        pipe_speed.value = (pipe_speed.value / 3.281).toFixed(2)
    }
})

const tvdConv = computed(() => {
    if (tvdUnit.value == 'ft') {
        tvd.value = (tvd.value * 3.281).toFixed(0)
    } else {
        tvd.value = (tvd.value / 3.281).toFixed(0)
    }
})

let pipeSpeedBaseUnit
let dbBaseUnit
let odBaseUnit
let idBaseUnit
let pipeLengthBaseUnit
let dcODBaseUnit
let dcIDBaseUnit
let dcLengthBaseUnit
let mwBaseUnit
let tvdBaseUnit

// Calculations
const Vdp = computed(() => {
    if (store.inputUnits.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (store.inputUnits.pipeODUnit == 'mm') {
        odBaseUnit = store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        odBaseUnit = store.mainInputs.pipeOD
    }

    if (store.inputUnits.pipeIDUnit == 'mm') {
        idBaseUnit = store.mainInputs.pipeID / 1000 * 3.281 * 12
    } else {
        idBaseUnit = store.mainInputs.pipeID
    }

    if (pipeSpeedUnit.value == 'm/min') {
        pipeSpeedBaseUnit = pipe_speed.value * 3.281
    } else {
        pipeSpeedBaseUnit = pipe_speed.value
    }

    if (store.inputUnits.pipeLengthUnit == 'm') {
        pipeLengthBaseUnit = store.mainInputs.pipeLength * 3.281
    } else {
        pipeLengthBaseUnit = store.mainInputs.pipeLength
    }

    if (dcODUnit.value == 'mm') {
        dcODBaseUnit = dc_od.value / 1000 * 3.281 * 12
    } else {
        dcODBaseUnit = dc_od.value
    }

    if (dcIDUnit.value == 'mm') {
        dcIDBaseUnit = dc_id.value / 1000 * 3.281 * 12
    } else {
        dcIDBaseUnit = dc_id.value
    }

    if (dcLengthUnit.value == 'm') {
        dcLengthBaseUnit = dc_length.value * 3.281
    } else {
        dcLengthBaseUnit = dc_length.value
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (tvdUnit.value == 'm') {
        tvdBaseUnit = tvd.value * 3.281
    } else {
        tvdBaseUnit = tvd.value
    }
   
    // calculations
    if (closeEnded.value) {
        return pipeSpeedBaseUnit * (0.45 + odBaseUnit**2 / (dbBaseUnit**2 - odBaseUnit**2))
    }
    
    if (openEnded.value) {
        return pipeSpeedBaseUnit * (0.45 + (odBaseUnit**2 - idBaseUnit**2) / (dbBaseUnit**2 - odBaseUnit**2 + idBaseUnit**2))
    }
})

const maxPipeVel = computed(() => {return Vdp.value * 1.5}) 

const pipePressureLoss = computed(() => {
    if (store.inputUnits.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (store.inputUnits.pipeODUnit == 'mm') {
        odBaseUnit = store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        odBaseUnit = store.mainInputs.pipeOD
    }

    if (store.inputUnits.pipeIDUnit == 'mm') {
        idBaseUnit = store.mainInputs.pipeID / 1000 * 3.281 * 12
    } else {
        idBaseUnit = store.mainInputs.pipeID
    }

    if (pipeSpeedUnit.value == 'm/min') {
        pipeSpeedBaseUnit = pipe_speed.value * 3.281
    } else {
        pipeSpeedBaseUnit = pipe_speed.value
    }

    if (store.inputUnits.pipeLengthUnit == 'm') {
        pipeLengthBaseUnit = store.mainInputs.pipeLength * 3.281
    } else {
        pipeLengthBaseUnit = store.mainInputs.pipeLength
    }

    if (dcODUnit.value == 'mm') {
        dcODBaseUnit = dc_od.value / 1000 * 3.281 * 12
    } else {
        dcODBaseUnit = dc_od.value
    }

    if (dcIDUnit.value == 'mm') {
        dcIDBaseUnit = dc_id.value / 1000 * 3.281 * 12
    } else {
        dcIDBaseUnit = dc_id.value
    }

    if (dcLengthUnit.value == 'm') {
        dcLengthBaseUnit = dc_length.value * 3.281
    } else {
        dcLengthBaseUnit = dc_length.value
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (tvdUnit.value == 'm') {
        tvdBaseUnit = tvd.value * 3.281
    } else {
        tvdBaseUnit = tvd.value
    }

    return (2.4 * maxPipeVel.value / (dbBaseUnit - odBaseUnit) * (2 * n.value + 1) / (3 * n.value))**n.value * K.value * pipeLengthBaseUnit /  (300 * (dbBaseUnit - odBaseUnit))
})

const Vdc = computed(() => {
    if (store.inputUnits.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (store.inputUnits.pipeODUnit == 'mm') {
        odBaseUnit = store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        odBaseUnit = store.mainInputs.pipeOD
    }

    if (store.inputUnits.pipeIDUnit == 'mm') {
        idBaseUnit = store.mainInputs.pipeID / 1000 * 3.281 * 12
    } else {
        idBaseUnit = store.mainInputs.pipeID
    }

    if (pipeSpeedUnit.value == 'm/min') {
        pipeSpeedBaseUnit = pipe_speed.value * 3.281
    } else {
        pipeSpeedBaseUnit = pipe_speed.value
    }

    if (store.inputUnits.pipeLengthUnit == 'm') {
        pipeLengthBaseUnit = store.mainInputs.pipeLength * 3.281
    } else {
        pipeLengthBaseUnit = store.mainInputs.pipeLength
    }

    if (dcODUnit.value == 'mm') {
        dcODBaseUnit = dc_od.value / 1000 * 3.281 * 12
    } else {
        dcODBaseUnit = dc_od.value
    }

    if (dcIDUnit.value == 'mm') {
        dcIDBaseUnit = dc_id.value / 1000 * 3.281 * 12
    } else {
        dcIDBaseUnit = dc_id.value
    }

    if (dcLengthUnit.value == 'm') {
        dcLengthBaseUnit = dc_length.value * 3.281
    } else {
        dcLengthBaseUnit = dc_length.value
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (tvdUnit.value == 'm') {
        tvdBaseUnit = tvd.value * 3.281
    } else {
        tvdBaseUnit = tvd.value
    }
    // calculations
    if (closeEnded.value) {
        return pipeSpeedBaseUnit * (0.45 + dcODBaseUnit**2 / (dbBaseUnit**2 - dcODBaseUnit**2))
    }
    
    if (openEnded.value) {
        return pipeSpeedBaseUnit * (0.45 + (dcODBaseUnit**2 - dcIDBaseUnit**2) / (dbBaseUnit**2 - dcODBaseUnit**2 + dcIDBaseUnit**2))
    }
})

const maxDcVel = computed(() => {return Vdc.value * 1.5})

const dcPressureLoss = computed(() => {
    if (store.inputUnits.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (store.inputUnits.pipeODUnit == 'mm') {
        odBaseUnit = store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        odBaseUnit = store.mainInputs.pipeOD
    }

    if (store.inputUnits.pipeIDUnit == 'mm') {
        idBaseUnit = store.mainInputs.pipeID / 1000 * 3.281 * 12
    } else {
        idBaseUnit = store.mainInputs.pipeID
    }

    if (pipeSpeedUnit.value == 'm/min') {
        pipeSpeedBaseUnit = pipe_speed.value * 3.281
    } else {
        pipeSpeedBaseUnit = pipe_speed.value
    }

    if (store.inputUnits.pipeLengthUnit == 'm') {
        pipeLengthBaseUnit = store.mainInputs.pipeLength * 3.281
    } else {
        pipeLengthBaseUnit = store.mainInputs.pipeLength
    }

    if (dcODUnit.value == 'mm') {
        dcODBaseUnit = dc_od.value / 1000 * 3.281 * 12
    } else {
        dcODBaseUnit = dc_od.value
    }

    if (dcIDUnit.value == 'mm') {
        dcIDBaseUnit = dc_id.value / 1000 * 3.281 * 12
    } else {
        dcIDBaseUnit = dc_id.value
    }

    if (dcLengthUnit.value == 'm') {
        dcLengthBaseUnit = dc_length.value * 3.281
    } else {
        dcLengthBaseUnit = dc_length.value
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (tvdUnit.value == 'm') {
        tvdBaseUnit = tvd.value * 3.281
    } else {
        tvdBaseUnit = tvd.value
    }
    return (2.4 * maxDcVel.value / (dbBaseUnit - dcODBaseUnit) * (2 * n.value + 1) / (3 * n.value))**n.value * K.value * dcLengthBaseUnit /  (300 * (dbBaseUnit - dcODBaseUnit))
})

const totalPressureLoss = () => {return pipePressureLoss.value + dcPressureLoss.value}

const hydPressure = computed(() => {
    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (tvdUnit.value == 'm') {
        tvdBaseUnit = tvd.value * 3.281
    } else {
        tvdBaseUnit = tvd.value
    }

    return 0.052 * mwBaseUnit * tvdBaseUnit
})

const surge = computed(() => {
    
    if (surgeUnit.value == 'psi') {
        return (hydPressure.value + totalPressureLoss()).toFixed(0)
    } else {
        return ((hydPressure.value + totalPressureLoss()) / 0.145).toFixed(0)
    }
    
})

const swab = computed(() => {
    if (swabUnit.value == 'psi') {
        return (hydPressure.value - totalPressureLoss()).toFixed(0)
    } else {
        return ((hydPressure.value - totalPressureLoss()) / 0.145).toFixed(0)
    }
    
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-2 align-items-start justify-content-between">
            <div class="inputs">
                <div class="form-check">
                    <input @click="openEndedPipe" class="form-check-input" type="radio" name="inputMethod" id="method-1" checked>
                    <label class="form-check-label" for="method-1">Open Ended Pipe</label>
                </div>

                <div class="form-check">
                    <input @click="closeEndedPipe" class="form-check-input" type="radio" name="inputMethod" id="method-2">
                    <label class="form-check-label" for="method-2">Closed Ended Pipe</label>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="n" step="0.1" placeholder="flow-behavior-index" v-model="n">
                        <label for="n" class="form-label">n</label>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="K" step="0.1" placeholder="consistency-index" v-model="K">
                        <label for="K" class="form-label">K</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3"><sup>lbs</sup>/<sub>100 ft<sup>2</sup></sub> sec<sup>n</sup></span>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="dc_od" step="0.01" placeholder="dc_od" v-model="dc_od">
                        <label for="dc_od" class="form-label">Drill Collar OD</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="dcODConv" v-model="dcODUnit" class="form-select border-info">
                            <option>inch</option>
                            <option>mm</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="dc_id" step="0.01" placeholder="dc_id" v-model="dc_id">
                        <label for="dc_id" class="form-label">Drill Collar ID</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="dcIDConv" v-model="dcIDUnit" class="form-select border-info">
                            <option>inch</option>
                            <option>mm</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="dc_length" step="0.01" placeholder="dc_length" v-model="dc_length">
                        <label for="dc_length" class="form-label">Drill Collar Length</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="dcLengthConv" v-model="dcLengthUnit" class="form-select border-info">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="pipe-speed" step="1" placeholder="pipe-speed" v-model="pipe_speed">
                        <label for="pipe-speed" class="form-label">Pipe Travel Speed</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="pipeSpeedConv" v-model="pipeSpeedUnit" class="form-select border-info">
                            <option>ft/min</option>
                            <option>m/min</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="tvd" step="0.01" placeholder="tvd" v-model="tvd">
                        <label for="tvd" class="form-label">Well TVD</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="tvdConv" v-model="tvdUnit" class="form-select border-info">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>

            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Surge</span>
                        <h3 class="text-center text-success">{{ surge }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="surgeUnit">
                                <option>psi</option>
                                <option>kPa</option>
                            </select>
                        </span>
                    </div>
                </div>

                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Swab</span>
                        <h3 class="text-center text-success">{{ swab }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="swabUnit">
                                <option>psi</option>
                                <option>kPa</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>