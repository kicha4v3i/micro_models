<script setup>
import store from '@/store';
import { ref, computed } from 'vue'

// Data
const PV = ref('')
const dc = ref('')
const rho_p = ref('')
const n = ref('')
const K = ref('')

// Units
const dc_unit = ref('inch')
const rho_pUnit = ref('ppg')
const slipVelUnit = ref('ft/min')
const riseVelUnit = ref('ft/min')

// Input Method
const Method_1 = ref(true)
const Method_2 = ref(false)

// Select Input Method
const selectMethodOne = () => {
    Method_1.value = true
    Method_2.value = false
}

const selectMethodTwo = () => {
    Method_1.value = false
    Method_2.value = true
}

// Conversions
const cuttingsDiameterConv  = computed(() => {
    if (dc_unit.value == 'inch') {
        dc.value = (dc.value / 1000 * 3.281 * 12).toFixed(2)
    } else {
        dc.value = (dc.value * 1000 / 3.281 / 12).toFixed(2)
    }
})

const cuttingsDensityConv = computed(() => {
    if (rho_pUnit.value == 'ppg') {
        rho_p.value = (rho_p.value * 8.33).toFixed(2)
    } else {
        rho_p.value = (rho_p.value / 8.33).toFixed(2)
    }
})

// Calculations
const slipVelOne = computed(() => {
    let qBaseUnit
    let dbBaseUnit
    let dpBaseUnit
    let odBaseUnit
    let mwBaseUnit
    let rho_pBaseUnit

    // Convert to base units
    if (store.inputUnits.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrate / 3.7854
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

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

    if (dc_unit.value == 'mm') {
        dpBaseUnit = dc.value / 1000 * 3.281 * 12
    } else {
        dpBaseUnit = dc.value
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw 
    }

    if (rho_pUnit.value == 'g/cc') {
        rho_pBaseUnit = rho_p.value * 8.33
    } else {
        rho_pBaseUnit = rho_p.value
    }

    if (Method_1.value) {
        

        // Calculate Slip Velocity
        const svOne = 0.45 * PV.value / (mwBaseUnit * dpBaseUnit) * (Math.sqrt(36800 * dpBaseUnit / (PV.value / (mwBaseUnit * dpBaseUnit)) ** 2 * (rho_pBaseUnit / mwBaseUnit - 1) + 1) - 1)

        // Net Rise Velocity
        
        if (slipVelUnit.value == 'm/min') {
            return (svOne / 3.281).toFixed(2)
        } else {
            return svOne.toFixed(2)
        }   
    }

    if (Method_2.value) {
        console.log(Method_2.value)
        // Calculate Annular Velocity
        const av = 24.51 * qBaseUnit / (dbBaseUnit * dbBaseUnit - odBaseUnit * odBaseUnit)

        // Calculate equivalent viscosity
        const mu_eq = (2.4 * av / (dbBaseUnit - odBaseUnit) * (2 * n.value + 1) / (3 * n.value)) ** n.value * (200 * K.value * (dbBaseUnit - odBaseUnit) / av)

        // Calculate slip velocity
        const svTwo = (rho_pBaseUnit - mwBaseUnit) ** 0.667 * 175 * dpBaseUnit / (mwBaseUnit ** 0.333 * mu_eq ** 0.333)
        console.log((rho_pBaseUnit - mwBaseUnit) ** 0.667 * 175 * dpBaseUnit)
        if (slipVelUnit.value == 'm/min') {
            return (svTwo / 3.281).toFixed(2)
        } else {
            return svTwo.toFixed(2)
        }
        
    }
})

const riseVel = computed(() => {

    let qBaseUnit
    let dbBaseUnit
    let odBaseUnit
    let svBaseUnit

    // Convert to base units
    if (store.inputUnits.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrate / 3.7854
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

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

    if (slipVelUnit.value == 'm/min') {
        svBaseUnit = slipVelOne.value * 3.281
    } else {
        svBaseUnit = slipVelOne.value
    }

    // Calculate Annular Velocity
    const av = 24.51 * qBaseUnit / (dbBaseUnit * dbBaseUnit - odBaseUnit * odBaseUnit)
    
    if (riseVelUnit.value == 'ft/min') {
        return (av - svBaseUnit).toFixed(2)
    } else {
        return ((av - svBaseUnit) / 3.281).toFixed(2)
    }
    
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Cuttings Slip Velocity</h3>

                <div class="form-check">
                    <input @click="selectMethodOne" class="form-check-input" type="radio" name="inputMethod" id="method-1" checked>
                    <label class="form-check-label" for="method-1">Chien's Correlation</label>
                </div>

                <div class="form-check">
                    <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-2">
                    <label class="form-check-label" for="method-2">Preston and Moore</label>
                </div>

                <div v-if="Method_1">
                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="pv" step="0.1" placeholder="plasticViscosity" v-model="PV">
                            <label for="pv" class="form-label">Plastic Viscosity</label>
                        </div>
                        <span class="align-baseline text-secondary fs-6 ms-3">cP</span>
                    </div>

                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="cuttings-diameter" step="0.01" placeholder="cuttingsDiameter" v-model="dc">
                            <label for="cuttings-diameters" class="form-label">Cuttings Diameter</label>
                        </div>
                        <div class="unit ms-3">
                            <select @change="cuttingsDiameterConv" v-model="dc_unit" class="form-select border-info">
                                <option>inch</option>
                                <option>mm</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="cuttings-density" step="0.01" placeholder="cuttingsDensity" v-model="rho_p">
                            <label for="cuttins-density" class="form-label">Cuttings Density</label>
                        </div>
                        <div class="unit ms-3">
                            <select @change="cuttingsDensityConv" v-model="rho_pUnit" class="form-select border-info">
                                <option>ppg</option>
                                <option>g/cc</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div v-if="Method_2">
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
                            <input class="form-control" type="number" min="0" id="cuttings-diameter" step="0.01" placeholder="cuttingsDiameter" v-model="dc">
                            <label for="cuttings-diameters" class="form-label">Cuttings Diameter</label>
                        </div>
                        <div class="unit ms-3">
                            <select @change="cuttingsDiameterConv" v-model="dc_unit" class="form-select border-info">
                                <option>inch</option>
                                <option>mm</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex mt-3 align-items-center">
                        <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="cuttings-density" step="0.01" placeholder="cuttingsDensity" v-model="rho_p">
                            <label for="cuttins-density" class="form-label">Cuttings Density</label>
                        </div>
                        <div class="unit ms-3">
                            <select @change="cuttingsDensityConv" v-model="rho_pUnit" class="form-select border-info">
                                <option>ppg</option>
                                <option>g/cc</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end flex-column justify-content-center">
                    <div class="slip-velocity mb-5">
                        <div class="lp-height-out">
                            <span class="text-secondary text-uppercase fs-6">Slip Velocity</span>
                            <h3 class="text-center text-success">{{ slipVelOne }}</h3>
                        </div>
                        <div class="lp-height-unit">
                            <span>
                                <select class="form-select" v-model="slipVelUnit">
                                    <option>ft/min</option>
                                    <option>m/min</option>
                                </select>
                            </span>
                        </div>
                    </div>

                    <div class="rise-velocity">
                        <div class="lp-height-out">
                            <span class="text-secondary text-uppercase fs-6">Rise Velocity</span>
                            <h3 class="text-center text-success">{{ riseVel }}</h3>
                        </div>
                        <div class="lp-height-unit">
                            <span>
                                <select class="form-select" v-model="riseVelUnit">
                                    <option>ft/min</option>
                                    <option>m/min</option>
                                </select>
                            </span>
                        </div>  
                    </div>
                    
                    
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>