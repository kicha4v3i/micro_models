<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const nozzleVel = ref('')
const dPBit = ref('')

// Units
const nozzleVelUnit = ref('ft/sec')
const dPBitUnit = ref('psi')
const iFUnit = ref('lbs')

// Input Method
const Velocity = ref(true)
const dP = ref(false)

// Select method
const velMethod = () => {
    if (Velocity.value == false) {
        Velocity.value = true
        dP.value = false
    }
}

const dPMethod = () => {
    if (dP.value == false) {
        dP.value = true
        Velocity.value = false
    }
}

// Conversion
const nozzleVelConv = computed(() => {
    if (nozzleVelUnit.value == 'ft/sec') {
        nozzleVel.value = (nozzleVel.value * 3.281).toFixed(0)
    } else {
        nozzleVel.value = (nozzleVel.value / 3.281).toFixed(0)
    }
})

const dPConv = computed(() => {
    if (dPBitUnit.value == 'psi') {
        dPBit.value = (dPBit.value * 0.145).toFixed(0)
    } else {
        dPBit.value = (dPBit.value / 0.145).toFixed(0)
    }
})

// Calculations
const impactForce = computed(() => {
    let qBaseUnit
    let mwBaseUnit
    let nozzleVelBaseUnit
    let dPBitBaseUnit

    if (store.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrateConv('gpm')
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

    if (store.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mwConv('ppg')
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (nozzleVelUnit.value == 'm/sec') {
        nozzleVelBaseUnit = nozzleVel.value *3.281
    } else {
        nozzleVelBaseUnit = nozzleVel.value
    }

    if (dPBitUnit.value == 'kPa') {
        dPBitBaseUnit = dPBit.value * 0.145
    } else {
        dPBitBaseUnit = dPBit.value
    }

    if (Velocity.value) {
        if (iFUnit.value == 'lbs') {
            console.log(iFUnit.value)
            return (mwBaseUnit * qBaseUnit * nozzleVelBaseUnit / 1930).toFixed(0)
        } else {
            console.log(iFUnit.value)
            return ((mwBaseUnit * qBaseUnit * nozzleVelBaseUnit / 1930) * 0.004448).toFixed(0)
        }
    } else {
        if (iFUnit.value == 'lbs') {
            console.log(iFUnit.value)
            return (0.0173 * qBaseUnit * Math.sqrt(dPBitBaseUnit * mwBaseUnit)).toFixed(0)
        } else {
            console.log(iFUnit.value)
            return ((0.0173 * qBaseUnit * Math.sqrt(dPBitBaseUnit * mwBaseUnit)) * 0.004448).toFixed(0)
        }
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Impact Force</h3>

                <div class="form-check">
                    <input @click="velMethod" class="form-check-input" type="radio" name="inputMethod" id="velocity" checked>
                    <label class="form-check-label" for="velocity">Bit Nozzle Velocity</label>
                </div>

                <div class="form-check">
                    <input @click="dPMethod" class="form-check-input" type="radio" name="inputMethod" id="dP">
                    <label class="form-check-label" for="dP">Bit Pressure Loss</label>
                </div>

                <div v-if="Velocity">
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="nozzleVel" step="0.01" placeholder="nozzleVel" v-model="nozzleVel">
                            <label for="nozzleVel" class="form-label">Nozzle Velocity</label>
                        </div>
                        <div class="unit ms-3">
                            <select @change="nozzleVelConv" v-model="nozzleVelUnit" class="form-select border-info">
                                <option>ft/sec</option>
                                <option>m/sec</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div v-if="dP">
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="dPBit" step="1" placeholder="dPBit" v-model="dPBit">
                            <label for="dPBit" class="form-label">Bit Pressure Loss</label>
                        </div>
                        <div class="unit ms-3">
                            <select @change="dPConv" v-model="dPBitUnit" class="form-select border-info">
                                <option>psi</option>
                                <option>kPa</option>
                            </select>
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Impact Force</span>
                        <h3 class="text-center text-success">{{ impactForce }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="iFUnit">
                                <option>lbs</option>
                                <option>kN</option>
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
