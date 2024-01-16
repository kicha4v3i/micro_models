<script setup>
import {ref, computed } from 'vue'
import store from '@/store';

// Data
const wob = ref('')
const rop = ref('')
const rpm = ref('')
const mu = ref('')
const torque = ref('')

// Units
const wobUnit = ref('lbs')
const ropUnit = ref('ft/min')
const mseUnit = ref('psi')
const torqueUnit = ref('ft-lbs')

// Conversions
const wobConv = computed (() => {
    if (wobUnit.value == 'MT') {
        wob.value = (wob.value / 2204.62).toFixed(2)
    } else {
        wob.value = (wob.value * 2204.62).toFixed(2)
    }
})

const ropConv = computed(() => {
    if (ropUnit.value == 'ft/min') {
        rop.value = (rop.value * 3.281).toFixed(2)
    } else {
        rop.value = (rop.value / 3.281).toFixed(2)
    }
})

const torqueConv = computed(() => {
    if (torqueUnit.value == 'ft-lbs') {
        torque.value = (torque.value * 0.73756).toFixed(0)
    } else {
        torque.value = (torque.value / 0.73756).toFixed(0)
    }
})

// Input Methods
const methodOne = ref(false)
const methodTwo = ref(true)

// Select methods
const selectMethodOne = () => {
    methodOne.value = true
    methodTwo.value = false
} 

const selectMethodTwo = () => {
    methodOne.value = false
    methodTwo.value = true
} 

// Calculations
const mse = computed(() => {
    let wobBaseUnit
    let ropBaseUnit
    let dbBaseUnit
    let torqueBaseUnit

    // Base Unit conversions
    if (wobUnit.value == 'MT') {
        wobBaseUnit = wob.value / 2204.62
    } else {
        wobBaseUnit = wob.value
    }

    if (ropUnit.value == 'm/min') {
        ropBaseUnit = rop.value * 3.281
    } else {
        ropBaseUnit = rop.value
    }

    if (store.inputUnits.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (torqueUnit.value == 'Nm') {
        torqueBaseUnit = torque.value * 0.73756
    } else {
        torqueBaseUnit = torque.value
    }

    // Hole Area
    const Ab = Math.PI / 4 * (dbBaseUnit ** 2)

    if (methodOne.value) {
        if (mseUnit.value == 'psi') {
            return (wobBaseUnit * (1 / Ab + (13.33 * mu.value * rpm.value) / (ropBaseUnit * dbBaseUnit))).toFixed(0)
        } else {
            return ((wobBaseUnit * (1 / Ab + (13.33 * mu.value * rpm.value) / (ropBaseUnit * dbBaseUnit))) / 0.145).toFixed(0)
        }
    }

    if (methodTwo.value){
        if (mseUnit.value == 'psi') {
            return ((480 * torqueBaseUnit * rpm.value) / (ropBaseUnit * dbBaseUnit ** 2) + (1.274 * wobBaseUnit) / (dbBaseUnit **2)).toFixed(0)
        } else {
            return (((480 * torqueBaseUnit * rpm.value) / (ropBaseUnit * dbBaseUnit ** 2) + (1.274 * wobBaseUnit) / (dbBaseUnit **2)) / 0.145).toFixed(0)
        }
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Mechanical Specific Energy</h3>

                <div class="form-check">
                    <input @click="selectMethodOne" class="form-check-input" type="radio" name="inputMethod" id="method-1" checked>
                    <label class="form-check-label" for="method-1">Coefficient of Friction</label>
                </div>

                <div class="form-check">
                    <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-2">
                    <label class="form-check-label" for="method-2">Bit Torque</label>
                </div>

                
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="WOB" step="1" placeholder="WOB" v-model="wob">
                        <label for="WOB" class="form-label">Weight on Bit</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="wobConv" v-model="wobUnit" class="form-select border-info">
                            <option>lbs</option>
                            <option>MT</option>
                        </select>
                    </div>
                </div>

                <div v-if="methodOne">
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="mu" step="1" placeholder="coefficient of friction" v-model="mu">
                            <label for="mu" class="form-label">Coefficient of Friction</label>
                        </div>
                    </div>
                </div>

                <div v-if="methodTwo">
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="torque" step="1" placeholder="Torque" v-model="torque">
                            <label for="torque" class="form-label">Bit Torque</label>
                        </div>
                        <div class="unit ms-3">
                            <select @change="torqueConv" v-model="torqueUnit" class="form-select border-info">
                                <option>ft-lbs</option>
                                <option>Nm</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="rpm" step="1" placeholder="RPM" v-model="rpm">
                        <label for="rpm" class="form-label">RPM</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">RPM</span>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="ROP" step="1" placeholder="Rate of Penetration" v-model="rop">
                        <label for="ROP" class="form-label">Rate of Penetration</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="ropConv" v-model="ropUnit" class="form-select border-info">
                            <option>ft/min</option>
                            <option>m/min</option>
                        </select>
                    </div>
                </div>
               

            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Mechanical Specific Energy</span>
                        <h3 class="text-center text-success">{{ mse }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="mseUnit">
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