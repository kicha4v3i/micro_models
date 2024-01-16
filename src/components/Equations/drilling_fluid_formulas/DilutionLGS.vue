<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const mudVol = ref('')
const solidsPercent = ref('')
const solidsPercentReq = ref('')
const solidsPercentDF = ref('')

// Dilution Fluid
const dilutionFluid = ref('Base Fluid')

// Units
const mudVolUnit = ref('bbls')

// Conversions
let preMudVol = 'bbls'
const mudVolConv = computed(() => {
    if (preMudVol == 'bbls') {
        if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value * 42).toFixed(1)
            preMudVol = 'gal'
        } else if (mudVolUnit.value == 'cu.m') {
            mudVol.value = (mudVol.value * 0.1589).toFixed(3)
            preMudVol = 'cu.m'
        } else {
            mudVol.value = (mudVol.value * 5.615).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else if (preMudVol == 'gal') {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value / 42).toFixed(3)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'cu.m') {
            mudVol.value = (mudVol.value * 0.00378).toFixed(3)
            preMudVol = 'cu.m'
        } else {
            mudVol.value = (mudVol.value * 0.13368).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else if (preMudVol == 'cu.m') {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value / 0.1589).toFixed(1)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value / 0.00378).toFixed(1)
            preMudVol = 'gal'
        } else {
            mudVol.value = (mudVol.value * 35.3147).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value /5.615).toFixed(1)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value / 0.13368).toFixed(1)
            preMudVol = 'gal'
        } else {
            mudVol.value = (mudVol.value / 35.3147).toFixed(3)
            preMudVol = 'cu.m'
        }
    }
})

// Calculations
const volReq = computed(() => {
    // Base Units
    let mudVolBase
    if (mudVolUnit.value == 'cu.ft') {
        mudVolBase = mudVol.value / 5.615
    } else if (mudVolUnit.value == 'cu.m') {
        mudVolBase = mudVol.value / 0.1589
    } else if (mudVolUnit.value == 'gal') {
        mudVolBase = mudVol.value / 42
    } else {
        mudVolBase = mudVol.value
    }

    // Calculation
    if (dilutionFluid.value == 'Base Fluid') {
        if (mudVolUnit.value == 'bbls'){
            return mudVolBase * (solidsPercent.value - solidsPercentReq.value) / solidsPercentReq.value
        } else if (mudVolUnit.value == 'gal') {
            return (mudVolBase * (solidsPercent.value - solidsPercentReq.value) / solidsPercentReq.value) * 42
        } else if (mudVolUnit.value == 'cu.ft') {
            return (mudVolBase * (solidsPercent.value - solidsPercentReq.value) / solidsPercentReq.value) * 5.615
        } else {
            return (mudVolBase * (solidsPercent.value - solidsPercentReq.value) / solidsPercentReq.value) * 0.1589
        }
        
    } else {
        if (mudVolUnit.value == 'bbls') {
            return mudVolBase * (solidsPercent.value - solidsPercentReq.value) / (solidsPercentReq.value - solidsPercentDF.value)
        } else if (mudVolUnit.value == 'gal') {
            return (mudVolBase * (solidsPercent.value - solidsPercentReq.value) / (solidsPercentReq.value - solidsPercentDF.value)) * 42
        } else if (mudVolUnit.value == 'cu.ft') {
            return (mudVolBase * (solidsPercent.value - solidsPercentReq.value) / (solidsPercentReq.value - solidsPercentDF.value)) * 5.615
        } else {
            return (mudVolBase * (solidsPercent.value - solidsPercentReq.value) / (solidsPercentReq.value - solidsPercentDF.value)) * 0.1589
        }
    }
})

</script>
<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-start">
            <div class="inputs">
                <!-- Select Dilution Fluid -->
                <p class="fw-medium">Select Dilution Fluid</p>
                <div class="form-check">
                    <input @click="selectMethodOne" class="form-check-input" type="radio" name="inputMethod" id="method-1" value="Base Fluid" v-model="dilutionFluid" checked>
                    <label class="form-check-label" for="method-1">Base Fluid</label>
                </div>

                <div class="form-check">
                    <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-2" value="Drilling Fluid" v-model="dilutionFluid">
                    <label class="form-check-label" for="method-2">Drilling Fluid</label>
                </div>

                <!-- Volume of Mud -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="mudVolume" step="1" placeholder="consistencyIndex" v-model="mudVol">
                        <label for="mudVolume" class="form-label">Volume of Mud</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="mudVolConv" v-model="mudVolUnit" class="form-select border-info">
                            <option>bbls</option>
                            <option>cu.ft</option>
                            <option>cu.m</option>
                            <option>gal</option>
                        </select>
                    </div>
                </div>

                <!-- % of LGS -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="solidsPercent" step="1" placeholder="%ofSolids" v-model="solidsPercent">
                        <label for="solidsPercent" class="form-label">% of LGS in Mud</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                </div>

                <!-- % of LGS in Added Fluid -->
                <div v-if="dilutionFluid == 'Drilling Fluid'">
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="solidsPercentDF" step="1" placeholder="%ofSolids" v-model="solidsPercentDF">
                            <label for="solidsPercentDF" class="form-label">% of LGS in added Fluid</label>
                        </div>
                        <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                    </div>
                </div>

                <!-- Required % of LGS -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="solidsPercentReq" step="1" placeholder="%ofSolids" v-model="solidsPercentReq">
                        <label for="solidsPercentReq" class="form-label">% of LGS Required</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                </div>

            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Volume of Fluid to Add</span>
                        <h3 class="text-center text-success">{{ volReq.toFixed(0) }} {{ mudVolUnit }}</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>