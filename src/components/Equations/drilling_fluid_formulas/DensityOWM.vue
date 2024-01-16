<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const oilDensity = ref('')
const waterDensity = ref('')
const oilPercent = ref('')
const waterPercent = ref('')

// Units
const oilDensityUnit = ref('ppg')
const waterDensityUnit = ref('ppg')
const densityUnit = ref('ppg')

// Conversions
const oilDensityConv = computed(() => {
    if (oilDensityUnit.value == 'ppg') {
        oilDensity.value = (oilDensity.value * 8.33).toFixed(2)
    } else {
        oilDensity.value = (oilDensity.value / 8.33 ).toFixed(2)
    }
})

const waterDensityConv = computed(() => {
    if (waterDensityUnit.value == 'ppg') {
        waterDensity.value = (waterDensity.value * 8.33).toFixed(2)
    } else {
        waterDensity.value = (waterDensity.value / 8.33).toFixed(2)
    }
})

// Calculations
const density = computed(() => {
    // Base Units
    let oilDensBase
    let waterDensBase

    if (oilDensityUnit.value == 'ppg') {
        oilDensBase = oilDensity.value
    } else {
        oilDensBase = oilDensity.value * 8.33
    }

    if (waterDensityUnit.value == 'ppg') {
        waterDensBase = waterDensity.value
    } else {
        waterDensBase = waterDensity.value * 8.33
    }

    // Calculation
    if (densityUnit.value == 'ppg') {
        return (oilDensBase * oilPercent.value + waterDensBase * waterPercent.value) / (oilPercent.value + waterPercent.value)
    } else {
        return ((oilDensBase * oilPercent.value + waterDensBase * waterPercent.value) / (oilPercent.value + waterPercent.value) / 8.33)
    }
})

</script>

<template>
     <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-start">
            <div class="inputs">
                <!-- % of Oil -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="oilPercent" step="1" placeholder="%ofOil" v-model="oilPercent">
                        <label for="oilPercent" class="form-label">Oil %</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                </div>

                <!-- % of Water -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="waterPercent" step="1" placeholder="%ofWater" v-model="waterPercent">
                        <label for="waterPercent" class="form-label">Water %</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                </div>

                <!-- Density of Oil -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="oilDensity" step="0.1" placeholder="Oil Density" v-model="oilDensity">
                        <label for="oilDensity" class="form-label">Oil Density</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="oilDensityConv" v-model="oilDensityUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>

                <!-- Density of Water -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="waterDensity" step="0.1" placeholder="Water Density" v-model="waterDensity">
                        <label for="waterDensity" class="form-label">Water Density</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="waterDensityConv" v-model="waterDensityUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>



            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Fluid Density</span>
                        <h3 class="text-center text-success">{{ density.toFixed(2) }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="densityUnit">
                                <option>ppg</option>
                                <option>g/cc</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>