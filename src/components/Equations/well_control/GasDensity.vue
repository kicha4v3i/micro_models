<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const Sg = ref('')
const gasPress = ref('')
const z = ref('')
const temp = ref('')

// Units
const gasPressUnit = ref('psi')
const tempUnit = ref('°R')

/* Temp Unit Memory */
let  prevTempUnit = '°R'

// Conversions
const gasPressConv = computed(() => {
    if (gasPressUnit.value == 'psi') {
        gasPress.value = (gasPress.value * 0.145).toFixed(0)
    } else {
        gasPress.value = (gasPress.value / 0.145).toFixed(0)
    }
})

const tempConv = computed(() => {
    if (prevTempUnit == '°R') {
        if (tempUnit.value == '°C') {
            temp.value = ((temp.value - 491.67) * 5 / 9).toFixed(2)
            prevTempUnit = '°C'
        } else if (tempUnit.value == '°F') {
            temp.value = (temp.value - 459.67).toFixed(2)
            prevTempUnit = '°F'
        } else {
            temp.value = (temp.value * 5 / 9).toFixed(2)
            prevTempUnit = '°K'
        }
    } else if (prevTempUnit == '°C') {
        if (tempUnit.value == '°R') {
            temp.value = (temp.value * 9 / 5 + 491.67).toFixed(2)
            prevTempUnit = '°R'
        } else if (tempUnit.value == '°F') {
            temp.value = ((temp.value * 9 / 5) + 32).toFixed(2)
            prevTempUnit = '°F'
        } else {
            temp.value = (parseFloat(temp.value) + 273.15).toFixed(2)
            prevTempUnit = '°K'
        }
    } else if (prevTempUnit == '°F') {
        if (tempUnit.value == '°R') {
            temp.value = (parseFloat(temp.value) + 459.67).toFixed(2)
            prevTempUnit = '°R'
        } else if (tempUnit.value == '°C') {
            temp.value = ((temp.value - 32) * 5 / 9).toFixed(2)
            prevTempUnit = '°C'
        } else {
            temp.value = ((temp.value - 32) * 5 / 9 + 273.15).toFixed(2)
            prevTempUnit = '°K'
        }
    } else {
        if (tempUnit.value == '°R') {
            temp.value = (temp.value * 1.8).toFixed(2)
            prevTempUnit = '°R'
        } else if (tempUnit.value == '°C') {
            temp.value = (temp.value - 273.15).toFixed(2)
            prevTempUnit = '°C'
        } else {
            temp.value = ((temp.value - 273.15) * 9 / 5 + 32).toFixed(2)
            prevTempUnit = '°F'
        }
    }
})

// Calculations
const gasGradient = computed(() => {
    let pressBaseUnit
    let tempBaseUnit

    if (gasPressUnit.value == 'kPa') {
        pressBaseUnit = gasPress.value * 0.145
    } else {
        pressBaseUnit = gasPress.value
    }

    if (tempUnit.value == '°C') {
        tempBaseUnit = temp.value * 9 / 5 + 491.67
    } else if (tempUnit.value == '°F') {
        tempBaseUnit = temp.value + 459.67
    } else if (tempUnit.value == '°K') {
        tempBaseUnit = temp.value * 1.8
    } else {
        tempBaseUnit = temp.value
    }

    return ((Sg.value * pressBaseUnit) / (53.3 * z.value * tempBaseUnit)).toFixed(3)

})

</script>

<template>
     <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Gas Gradient</h3>

                <!-- Gas Gravity -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="Sg" step="0.1" placeholder="Gas Gravity" v-model="Sg">
                        <label for="Sg" class="form-label">Gas Specific Gravity</label>
                    </div>
                </div>

                <!-- Gas Pressure -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="gasPress" step="1" placeholder="Gas Pressure" v-model="gasPress">
                        <label for="gasPress" class="form-label">Pressure of Gas</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="gasPressConv" v-model="gasPressUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Compressibility Factor -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="compressibility" step="0.01" placeholder="Compressibility" v-model="z">
                        <label for="compressibility" class="form-label">Compressibility Factor</label>
                    </div>
                </div>

                <!-- Temperature of Gas -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="temperature" step="1" placeholder="Temperature" v-model="temp">
                        <label for="temperature" class="form-label">Temperature</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="tempConv" v-model="tempUnit" class="form-select border-info">
                            <option>°R</option>
                            <option>°C</option>
                            <option>°F</option>
                            <option>°K</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Gas Gradient</span>
                        <div class="d-flex justify-content-center">
                            <h3 class="text-center text-success">{{ gasGradient }}</h3>
                            <span class="align-baseline text-secondary fs-6 ms-3"><sup>psi</sup>/<sub>ft</sub></span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>