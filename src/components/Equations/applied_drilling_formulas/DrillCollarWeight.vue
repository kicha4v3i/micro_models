<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const wob = ref('')
const safety = ref('')
let mw = store.mainInputs.mw
let mw_conv_val = store.mainInputs.mw
const inc = ref('')
const deviated = ref(false)

//Data units
const wob_unit = ref('lbs')
const wob_sel_unit = ref('')
const mw_unit = store.mwUnit
const dc_weight_unit = ref('lbs')


//Buoyancy Factor
const bf = computed(() => {
    if (store.mainInputs.mw == null || store.mainInputs.mw == '') {
        return
    }
    
    if (store.inputUnits.mwUnit == 'ppg') {
        return (1 - store.mainInputs.mw / 65.5).toFixed(3)
    } else {
        return (1 - store.mainInputs.mw * 8.33 / 65.5).toFixed(3)
    }
})

// Conversions

//Mud Weight Conversion

//WOB Conversion
wob_sel_unit.value = wob_unit.value
const wob_unit_conv = computed(() => {
    
    if (wob_unit.value == 'lbs') {
        if (wob_sel_unit.value == 'MT') {
            wob.value = wob.value * 2204
            wob_sel_unit.value = wob_unit.value
        } else {
            wob.value = wob.value * 2.204
            wob_sel_unit.value = wob_unit.value
        }
    } else if (wob_unit.value == 'MT') {
        if (wob_sel_unit.value == 'lbs') {
            wob.value = wob.value / 2204
            wob_sel_unit.value = wob_unit.value
        } else {
            wob.value = wob.value / 1000
            wob_sel_unit.value = wob_unit.value
        }
    } else {
        // lbs to kg
        if (wob_sel_unit.value == 'lbs') {
            wob.value = wob.value / 2.204
            wob_sel_unit.value = wob_unit.value
            
        } else {
            // MT to kg
            wob.value = wob.value * 1000
            wob_sel_unit.value = wob_unit.value 
        }
    }
})

const lb_MT_conv = (unit, value) => {
    // MT to Pounds
    if (unit == 'lbs') {
        return value * 2204
    } 
    //Pounds to MT
    else {
        return value / 2204
    }
}

const lb_kg_conv = (unit, value) => {
    //kg to pounds
    if (unit == 'lbs') {
        return value * 2.204
    } 
    // Pounds to kg
    else {
        return value / 2.204
    }
}

const MT_kg_conv = (unit, value) => {
    // kg to MT
    if (unit == 'MT') {
        return value /1000
    } 
    // MT to kg
    else {
        return value * 1000
    }
}

// Calculations
const dc_weight = computed(() => {
    let wob_base_value
    //Convert to base units
    // WOB
    if (wob_unit.value == 'MT') {
        wob_base_value = lb_MT_conv('lbs', wob.value)
    } else if (wob_unit.value == 'kg') {
        wob_base_value = lb_kg_conv('lbs', wob.value)
    } else {
        wob_base_value = wob.value
    }

    // Return Drill Collar Weight
    if (dc_weight_unit.value == 'MT') {
        if (deviated) {
            return lb_MT_conv('MT', wob_base_value / bf.value / Math.cos(inc.value*Math.PI/180) * (1+safety.value/100)).toFixed(0)
        } else {
            return lb_MT_conv('MT', wob_base_value / bf.value * (1+safety.value/100)).toFixed(0)
        }
        
    } else if (dc_weight_unit.value == 'kg') {
        if (deviated) {
            return lb_kg_conv('kg', wob_base_value / bf.value / Math.cos(inc.value*Math.PI/180) * (1+safety.value/100)).toFixed(0)
        } else {
            return lb_kg_conv('kg', wob_base_value / bf.value * (1+safety.value/100)).toFixed(0)
        }
    } else {
        if (deviated) {
            return (wob_base_value / bf.value / Math.cos(inc.value*Math.PI/180) * (1+safety.value/100)).toFixed(0)
        } else {
            return (wob_base_value / bf.value * (1+safety.value/100)).toFixed(0)
        }
    }
    
})

// Activate deviated
const activateDeviated = () => {
    if (deviated.value == false) {
        deviated.value = !deviated.value
    }
}

const deActivateDeviated = () => {
    if (deviated.value == true) {
        deviated.value = !deviated.value
        inc.value = 0
    }
}

</script>

<template>
 
    <div class="d-flex">

        <div class="data-show d-flex ms-5 container-fluid align-items-center">
            <div class="inputs">
                <div>
                    <div class="form-check">
                        <input @click="deActivateDeviated" class="form-check-input" type="radio" name="well_type" id="vertical" checked>
                        <label class="form-check-label" for="vertical">
                            Vertical
                        </label>
                    </div>
                    <div class="form-check">
                        <input @click="activateDeviated" class="form-check-input" type="radio" name="well_type" id="deviated">
                        <label class="form-check-label" for="deviated">
                            Deviated
                        </label>
                    </div>
                </div>
                <div class="d-flex mt-3 align-items-center" id="wob">
                    <div class="form-floating">
                        <input v-model="wob" class="form-control" type="number" min="0" id="wob-input" placeholder="weight on bit">
                        <label for="wob-input" class="form-label">Required Weight on Bit</label>
                    </div>
                    <div class="unit ms-3">
                        <select class="form-select border-info" @change="wob_unit_conv" v-model="wob_unit">
                            <option>lbs</option>
                            <option>MT</option>
                            <option>kg</option>
                        </select>
                    </div>
                </div>
                
                <div class="d-flex mt-3 align-items-center" id="safety">
                    <div class="form-floating">
                        <input v-model="safety" class="form-control" type="number" min="0" id="safety-input" placeholder="safety factor">
                        <label for="safety-input" class="form-label">Safety Factor</label>
                    </div>
                    <div class="unit ms-3">
                        <span>%</span>
                    </div>
                </div>

                <div v-if="deviated" class="d-flex mt-3 align-items-center" id="deviated">
                    <div class="form-floating">
                        <input v-model="inc" class="form-control" type="number" min="0" id="inc" placeholder="Inclination">
                        <label for="inc" class="form-label">Inclination</label>
                    </div>
                    <div class="unit ms-3">
                        <span>°</span>
                    </div>
                </div>
                
            </div>

            <div class="outputs ms-5">
                <div class="d-flex flex-column align-items-center">
                    <div class="bf ms-5 me-5">
                        <span class="text-secondary text-uppercase">Buoyancy Factor</span>
                        <h3 class="text-center text-success">{{ bf }}</h3>
                    </div>
                </div>
                <div class="d-flex flex-column align-items-center">
                    <div class="dc_weight d-flex mt-5">
                        <div class="dc-weight-out">
                            <span class="text-secondary text-uppercase fs-6">Drill Collar Weight</span>
                            <h3 class="text-center text-success">{{ dc_weight }}</h3>
                        </div>
                        <div class="dc-weight-unit ">
                        <span>
                            <select class="form-select" v-model="dc_weight_unit">
                                <option>lbs</option>
                                <option>MT</option>
                                <option>kg</option>
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
