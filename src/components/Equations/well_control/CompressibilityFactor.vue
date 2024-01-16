<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const Sg = ref('')
const gasPress = ref('')
const temp = ref('')
const gasGradient = ref('')

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
            console.log(temp.value)
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
const z = computed(() => {
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

    

    // Pseudo Critical Pressure
    let P_pc = 756.8 - 131 * Sg.value - 3.6 * Sg.value**2

    // Pseudo Critical Temperature
    let T_pc = 169.2 + 349.5 * Sg.value - 74 * Sg.value**2

    // Reduced Pressure and Temperature
    let P_pr = pressBaseUnit / P_pc
    let T_pr = tempBaseUnit / T_pc

    // Calculate Z
    // Newton Raphson
    let f_x
    let f_dx
    let iterations = 100
    let tol = 0.0001
    let z_i = 0.1
    let z_i1
    for (let i=0; i<=iterations; i++) {
        f_x = (1+(0.3265-1.0700 * 1 / T_pr - 0.5339 * 1 / (T_pr**3) + 0.01569 * (1 / T_pr**4) - 0.05165 * (1 / T_pr**5)) * 0.27 * P_pr / (T_pr * z_i) + (0.5475 - 0.7361 / T_pr + 0.1844 / (T_pr**2)) * (0.27 * P_pr / (T_pr * z_i))**2 - 0.1056 * (-0.7361 / T_pr + 0.1844 / (T_pr**2)) * (0.27 * P_pr / (T_pr * z_i))**5 + 0.6134 * (1 + 0.7210 * (0.27 * P_pr / (T_pr * z_i))**2) * ((0.27 * P_pr / (T_pr * z_i))**2 / (T_pr**3)) * Math.pow(Math.E,(-0.721 * (0.27 * P_pr / (T_pr * z_i))**2))) - z_i
        f_dx = ((-0.27 * P_pr / T_pr / z_i**2) * (0.3265-1.0700 * 1 / T_pr - 0.5339 * 1 / (T_pr**3) + 0.01569 * (1 / T_pr**4) - 0.05165 * (1 / T_pr**5)) + 2 * (0.27 * P_pr / (T_pr * z_i)) * (-0.27 * P_pr / T_pr / z_i**2) * (0.5475 - 0.7361 / T_pr + 0.1844 / (T_pr**2)) + 5 * (0.27 * P_pr / (T_pr * z_i))**4 * (-0.27 * P_pr / T_pr / z_i**2) * (- 0.1056 * (-0.7361 / T_pr + 0.1844 / (T_pr**2))) + 0.6134 * (0.7210 * 2 * (0.27 * P_pr / (T_pr * z_i)) * (-0.27 * P_pr / T_pr / z_i**2)) * (0.27 * P_pr / (T_pr * z_i))**2 / (T_pr**3) * Math.pow(Math.E, -0.721 * (0.27 * P_pr / (T_pr * z_i))**2) + 0.6134 * (1 + 0.721 * (0.27 * P_pr / (T_pr * z_i))**2) * (2 * (0.27 * P_pr / (T_pr * z_i)) * (-0.27 * P_pr / T_pr / z_i**2) / (T_pr**3)) * Math.pow(Math.E, -0.721 * (0.27 * P_pr / (T_pr * z_i))**2) + 0.6134 * (1 + 0.721 * (0.27 * P_pr / (T_pr * z_i))**2) * ((0.27 * P_pr / (T_pr * z_i))**2 / (T_pr**3)) * (-0.721 * Math.pow(Math.E, -0.721 * (0.27 * P_pr / (T_pr * z_i))**2) * 2 * (0.27 * P_pr / (T_pr * z_i)) * (-0.27 * P_pr / T_pr / z_i**2))) - 1

        z_i1 = z_i - f_x / f_dx
        if (Math.abs(z_i1 - z_i) <= tol) {
            return z_i1
        } else {
            z_i = z_i1
        }
    }

    if (Sg.value == '' || gasPress.value == '' || temp.value == '') {
        return 0
    } else {
        return z_i1
    }
    
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Gas Compressibility Factor</h3>

                <!-- Specific Gravity of Gas -->
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
                        <span class="text-secondary text-uppercase fs-6">Gas Compressibility Factor</span>
                        <div class="d-flex justify-content-center">
                            <h3 class="text-center text-success">{{ z.toFixed(3) }}</h3>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>