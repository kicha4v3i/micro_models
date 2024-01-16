<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const rpm600 = ref('')
const rpm300 = ref('')
const n = ref('')
const K = ref('')

// Units
const fricPressPipeUnit = ref('psi')
const fricPressAnnUnit = ref('psi')

// Input Type
const viscometer = ref(true)
const rheoParams = ref(false)

// Select Method Type
const selectMethodOne = () => {
    viscometer.value = true
    rheoParams.value = false
}

const selectMethodTwo = () => {
    viscometer.value = false
    rheoParams.value = true
}

// Calculations
/* n and K values with Viscometer Readings */
const nComputed = computed(() => {
    if (viscometer.value) {
        return 3.32 * Math.log(rpm600.value / rpm300.value)
    } 
})

const KComputed = computed(() => {
    if (viscometer.value) {
        return rpm300.value / 511**nComputed.value
    } 
})

/* Plastic Viscosity */ 
const PV = computed(() => {
    if (viscometer.value) {
        return rpm600.value - rpm300.value
    } else {
        let theta300 = K.value * 511**n.value
        let theta600 =  theta300 * Math.exp(n.value / 3.32)
        return theta600 - theta300
    }
})

/* Base Units */
const mwBase = computed(() => {
    if (store.inputUnits.mwUnit == 'g/cc') {
        return store.mainInputs.mw * 8.33
    } else {
        return store.mainInputs.mw
    }
})

const bitSizeBaseUnit = computed(() => {
    if (store.inputUnits.bitSizeUnit == 'mm') {
        return store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        return store.mainInputs.bitSize
    }
})

const pipeODBaseUnit = computed(() => {
    if (store.inputUnits.pipeODUnit == 'mm') {
        return store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        return store.mainInputs.pipeOD
    }
})

const pipeIDBaseUnit = computed(() => {
    if (store.inputUnits.pipeIDUnit == 'mm') {
        return store.mainInputs.pipeID / 1000 * 3.281 * 12
    } else {
        return store.mainInputs.pipeID
    }
})

const flowrateBase = computed(() => {
    if (store.inputUnits.flowrateUnit == 'lpm') {
        return store.mainInputs.flowrate * 0.2642
    } else {
        return store.mainInputs.flowrate
    }
})

const pipeLengthBaseUnit = computed(() => {
    if (store.inputUnits.pipeLengthUnit == 'm') {
        return store.mainInputs.pipeLength * 3.281
    } else {
        return store.mainInputs.pipeLength
    }
})

/* Pipe Velocity */

const pipeVel = computed(() => {
    return (24.51 * flowrateBase.value / pipeIDBaseUnit.value**2) / 3.281 / 60
})

/* Annular Velocity */
const annVel = computed(() => {
    return 24.51 * flowrateBase.value / (bitSizeBaseUnit.value**2 - pipeODBaseUnit.value**2)
})

/* Pipe Reynolds Number */
const pipeRe = computed(() => {
    if (viscometer.value) {
        return (pipeIDBaseUnit.value / 12 / 3.281)**n.value * (pipeVel.value / 3.281 / 60)**(n.value - 2) * (mwBase.value / 8.33 * 1000) / (8**(n.value-1) * K.value)
    } else {
        return (pipeIDBaseUnit.value / 12 / 3.281)**nComputed.value * (pipeVel.value / 3.281 / 60)**(nComputed.value - 2) * (mwBase.value / 8.33 * 1000) / (8**(nComputed.value-1) * KComputed.value)
    }
    
})

/* Pipe Pressure Loss */
const fricLossPipe = computed(() => {
    if (viscometer.value) {
        // Laminar
        let lamLoss = ((1.6 * pipeVel.value / pipeIDBaseUnit.value) * (3 * nComputed.value + 1) / (4 * nComputed.value))**nComputed.value * KComputed.value * pipeLengthBaseUnit.value / 300

        // Turbulent
        let turbLoss = 7.7 * Math.pow(10, -5) * mwBase.value**0.8 * flowrateBase.value**1.8 * PV.value**0.2 * pipeLengthBaseUnit.value / (pipeIDBaseUnit.value**4.8)

        if (lamLoss > turbLoss) {
            if (fricPressPipeUnit.value == 'psi') {
                return lamLoss.toFixed(0)
            } else {
                return (lamLoss / 0.145).toFixed(0)
            }
        } else {
            if (fricPressPipeUnit.value == 'psi') {
                return turbLoss.toFixed(0)
            } else {
                return (turbLoss / 0.145).toFixed(0)
            }
        }
    } else {
        // Laminar
        let lamLoss = ((1.6 * pipeVel.value / pipeIDBaseUnit.value) * (3 * n.value + 1) / (4 * n.value))**n.value * K.value * pipeLengthBaseUnit.value / 300

        // Turbulent
        let turbLoss = 7.7 * Math.pow(10, -5) * mwBase.value**0.8 * flowrateBase.value**1.8 * PV.value**0.2 * pipeLengthBaseUnit.value / (pipeIDBaseUnit.value**4.8)

        if (lamLoss > turbLoss) {
            if (fricPressPipeUnit.value == 'psi') {
                return lamLoss.toFixed(0)
            } else {
                return (lamLoss / 0.145).toFixed(0)
            }
        } else {
            if (fricPressPipeUnit.value == 'psi') {
                return turbLoss.toFixed(0)
            } else {
                return (turbLoss / 0.145).toFixed(0)
            }
        }
    }
})

/* Annular Pressure Loss */
const fricLossAnn = computed(() => {
    if (viscometer.value) {
        // Laminar
        let lamLoss = ((2.4 * annVel.value / (bitSizeBaseUnit.value - pipeODBaseUnit.value)) * ((2 * nComputed.value + 1) / (3 * nComputed.value)))**nComputed.value * KComputed.value * pipeLengthBaseUnit.value / (300 * (bitSizeBaseUnit.value - pipeODBaseUnit.value))

        // Turbulent
        let turbLoss = 7.7 * Math.pow(10, -5) * mwBase.value**0.8 * flowrateBase.value**1.8 * PV.value**0.2 * pipeLengthBaseUnit.value / ((bitSizeBaseUnit.value - pipeODBaseUnit.value)**3 * (parseFloat(bitSizeBaseUnit.value) + parseFloat(pipeODBaseUnit.value))**1.8)
    
        if (lamLoss > turbLoss) {
            if (fricPressAnnUnit.value == 'psi') {
                return lamLoss.toFixed(0)
            } else {
                return (lamLoss / 0.145).toFixed(0)
            }
        } else {
            if (fricPressAnnUnit.value == 'psi') {
                return turbLoss.toFixed(0)
            } else {
                return (turbLoss / 0.145).toFixed(0)
            }
        }
    } else {
        // Laminar
        let lamLoss = ((2.4 * annVel.value / (bitSizeBaseUnit.value - pipeODBaseUnit.value)) * ((2 * n.value + 1) / (3 * n.value)))**n.value * K.value * pipeLengthBaseUnit.value / (300 * (bitSizeBaseUnit.value - pipeODBaseUnit.value))

        // Turbulent
        let turbLoss = 7.7 * Math.pow(10, -5) * mwBase.value**0.8 * flowrateBase.value**1.8 * PV.value**0.2 * pipeLengthBaseUnit.value / ((bitSizeBaseUnit.value - pipeODBaseUnit.value)**3 * (bitSizeBaseUnit.value + pipeODBaseUnit.value)**1.8)
    
        if (lamLoss > turbLoss) {
            if (fricPressAnnUnit.value == 'psi') {
                return lamLoss.toFixed(0)
            } else {
                return (lamLoss / 0.145).toFixed(0)
            }
        } else {
            if (fricPressAnnUnit.value == 'psi') {
                return turbLoss.toFixed(0)
            } else {
                return (turbLoss / 0.145).toFixed(0)
            }
        }
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <!-- Select Rheology Input -->
                <div class="form-check">
                    <input @click="selectMethodOne" class="form-check-input" type="radio" name="inputMethod" id="method-1" checked>
                    <label class="form-check-label" for="method-1">Viscometer Reading</label>
                </div>

                <div class="form-check">
                    <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-2">
                    <label class="form-check-label" for="method-2">Rheology Parameters</label>
                </div>

                <!-- Viscometer Reading -->
                <div v-if="viscometer">
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="rpm600" step="1" placeholder="RPM 600" v-model="rpm600">
                            <label for="rpm600" class="form-label">&theta;<sub>600</sub></label>
                        </div>
                    </div>
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="rpm300" step="1" placeholder="RPM 300" v-model="rpm300">
                            <label for="rpm300" class="form-label">&theta;<sub>300</sub></label>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="n" step="0.01" placeholder="n" v-model="n">
                            <label for="n" class="form-label">n</label>
                        </div>
                    </div>
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="K" step="0.01" placeholder="K" v-model="K">
                            <label for="K" class="form-label">K</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5 d-flex flex-column align-items-center">
                <!-- Pipe Pressure Loss -->
                <div class="lp-height d-flex align-items-end ms-5 mb-5">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Pipe Pressure Losses</span>
                        <h3 class="text-center text-success">{{ fricLossPipe }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="fricPressPipeUnit">
                                <option>psi</option>
                                <option>kPa</option>
                            </select>
                        </span>
                    </div>
                </div>

                <!-- Annular Pressure Loss -->
                <div class="lp-height d-flex align-items-end ms-5">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Annular Pressure Losses</span>
                        <h3 class="text-center text-success">{{ fricLossAnn }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="fricPressAnnUnit">
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