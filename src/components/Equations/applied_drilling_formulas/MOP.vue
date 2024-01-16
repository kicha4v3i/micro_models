<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const maxTensile = ref('')
const sf = ref(90)
const hookLoad = ref('')

// Units
const maxTensileUnit = ref('kLbs')
const hookLoadUnit = ref('kLbs')
const mopUnit = ref('kLbs')

// Conversions
const maxTensileConv = computed(() => {
    if (maxTensileUnit.value == 'kLbs') {
        maxTensile.value = (maxTensile.value * 2204 / 1000).toFixed(0)
    } else {
        maxTensile.value = (maxTensile.value / 2204 * 1000).toFixed(0)
    }
})

const hookLoadConv = computed(() => {
    if (hookLoadUnit.value == 'kLbs') {
        hookLoad.value = (hookLoad.value * 2204 / 1000).toFixed(0)
    } else {
        hookLoad.value = (hookLoad.value / 2204 * 1000).toFixed(0)
    }
})

// Calculations
const BF = computed(() => {
    if (store.inputUnits.mwUnit == 'ppg') {
        return 1 - store.mainInputs.mw / 65.5
    } else {
        return 1 - store.mainInputs.mw * 8.33 / 65.5
    }  
})

const MOP = computed(() => {
    let tensileBaseUnit
    let hookLoadBase

    if (maxTensileUnit.value == 'MT') {
        tensileBaseUnit = maxTensile.value * 2204 / 1000
    } else {
        tensileBaseUnit = maxTensile.value
    }

    if (hookLoadUnit.value == 'MT') {
        hookLoadBase = hookLoad.value * 2204 / 1000
    } else {
        hookLoadBase = hookLoad.value
    }

    if (mopUnit.value == 'kLbs') {
        return (tensileBaseUnit * sf.value / 100 - hookLoadBase * BF.value).toFixed(0)
    } else {
        return (tensileBaseUnit * sf.value / 100 - hookLoadBase * BF.value * 2204 / 1000).toFixed(0)
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <!-- Max Allowable Tensile Strength -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="maxTensile" step="1" placeholder="Max Tensile Strength" v-model="maxTensile">
                        <label for="maxTensile" class="form-label">Max Tensile Strength</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="maxTensileConv" v-model="maxTensileUnit" class="form-select border-info">
                            <option>kLbs</option>
                            <option>MT</option>
                        </select>
                    </div>
                </div>
                
                <!-- Safety Factor -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="safetyFactor" step="1" placeholder="Safety Factor" v-model="sf">
                        <label for="safetyFactor" class="form-label">Safety Factor</label>
                    </div>
                    <div class="unit ms-3">
                        <span>%</span>
                    </div>
                </div>
                
                <!-- Hookload -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="hookLoad" step="1" placeholder="Hook Load" v-model="hookLoad">
                        <label for="hookLoad" class="form-label">Hook Load</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="hookLoadConv" v-model="hookLoadUnit" class="form-select border-info">
                            <option>kLbs</option>
                            <option>MT</option>
                        </select>
                    </div>
                </div>

            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Margin of Overpull</span>
                        <h3 class="text-center text-success">{{ MOP }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="mopUnit">
                                <option>kLbs</option>
                                <option>MT</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>