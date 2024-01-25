<script setup>
import { onMounted, ref, watch } from 'vue'
import store from '../store/index.js'
import { supabase } from '../lib/supabaseClient.js'

// Load Data when signed in
window.onload = supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_IN') {
        // Get User ID
        const loggedInUserId = store.state.user.id
        // Check if user ID exists in Well Information Table
        
        loadData()
    }
})

const loadData = async () => {
    try {
        // If user id exists in Well Info db
        const { data, error } = await supabase.from('well_information').select('*').eq('id',store.state.user.id)
        if (error) throw error
        store.mainInputs.bitSize = data[0].bit_size
        store.mainInputs.mw = data[0].mud_weight
        store.mainInputs.flowrate = data[0].flowrate
        store.mainInputs.pipeOD = data[0].pipe_od
        store.mainInputs.pipeID = data[0].pipe_id
        store.mainInputs.pipeLength = data[0].pipe_length
    } catch {
        // If user id does not exist in Well Info db
        const { error } = await supabase.from('well_information').insert({id: store.state.user.id})
    }
}

// Store well info data to DB
const storeBitSize = async() => {
    try {
        console.log('executed bit size')
        const { data, error } = await supabase.from('well_information').update({'bit_size': store.mainInputs.bitSize}).eq('id',store.state.user.id).select()
    } catch (error) {
        console.log('error', error.message)
    }
}

const storeMudWeight = async() => {
    try {
        console.log('executed mud weight')
        const { data, error } = await supabase.from('well_information').update({'mud_weight': store.mainInputs.mw}).eq('id',store.state.user.id).select()
    } catch (error) {
        console.log('error', error.message)
    }
}

const storeFlowrate = async() => {
    try {
        console.log('executed mud weight')
        const { data, error } = await supabase.from('well_information').update({'flowrate': store.mainInputs.flowrate}).eq('id',store.state.user.id).select()
    } catch (error) {
            console.log(error.message)
    }
}

const storepipeOD = async() => {
    try {
        console.log('executed mud weight')
        const { data, error } = await supabase.from('well_information').update({'pipe_od': store.mainInputs.pipeOD}).eq('id',store.state.user.id).select()
    } catch (error) {
            console.log(error.message)
    }
}

const storePipeID = async() => {
    try {
        console.log('executed mud weight')
        const { data, error } = await supabase.from('well_information').update({'pipe_id': store.mainInputs.pipeID}).eq('id',store.state.user.id).select()
    } catch (error) {
            console.log(error.message)
    }
}

const storePipeLength = async() => {
    try {
        console.log('executed mud weight')
        const { data, error } = await supabase.from('well_information').update({'pipe_length': store.mainInputs.pipeLength}).eq('id',store.state.user.id).select()
    } catch (error) {
            console.log(error.message)
    }
}


</script>

<template>
    <div class="well-data position-absolute end-0 border-start border-tertiary ms-5 ps-5 py-5">
        <h5 class="text-success">Primary Inputs</h5>
        <div class="inputs d-flex flex-column">
                <!-- Bit Size -->
                <div class="d-flex align-items-baseline me-5">
                    <div class="form-floating mb-3 w-50">
                        <input @focusout="storeBitSize" v-model="store.mainInputs.bitSize" type="number" min="0" step="0.01" required class="form-control border-success text-success" id="bit-size" placeholder="Bit Size" />
                        <label for="bit-size">Bit Size</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="store.mainInputs.bitSizeConv(store.inputUnits.bitSizeUnit)" v-model="store.inputUnits.bitSizeUnit" class="form-select form-select-sm border-tertiary bg-body-tertiary">
                            <option>inch</option>
                            <option>mm</option>
                        </select>
                    </div>
                </div>

                <!-- Mud Weight -->
                <div class="d-flex align-items-baseline me-5">
                    <div class="form-floating mb-3 w-50">
                        <input @focusout="storeMudWeight" v-model="store.mainInputs.mw" type="number" min="0" step="0.1" required class="form-control border-success text-success" id="mud-weight" placeholder="Mud Weight" value="mudWeight" />
                        <label for="mud-weight">Mud Weight</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="store.mainInputs.mwConv(store.inputUnits.mwUnit)" v-model="store.inputUnits.mwUnit" class="form-select border-tertiary bg-body-tertiary">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>  
                </div>

                <!-- Flowrate -->
                <div class="d-flex align-items-baseline me-5">
                    <div class="form-floating mb-3 w-50">
                        <input @focusout="storeFlowrate" v-model="store.mainInputs.flowrate" type="number" min="0" step="1" required class="form-control border-success text-success" id="flowrate" placeholder="Flowrate" />
                        <label for="flowrate">Flowrate</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="store.mainInputs.flowrateConv(store.inputUnits.flowrateUnit)" v-model="store.inputUnits.flowrateUnit" class="form-select form-select-sm border-tertiary bg-body-tertiary">
                            <option>gpm</option>
                            <option>lpm</option>
                        </select>
                    </div>
                </div>

                <!-- Pipe Dimensions -->
                <!-- Pipe OD -->
                <div class="d-flex align-items-baseline me-5">
                    <div class="form-floating mb-3 w-50">
                        <input v-model="store.mainInputs.pipeOD" @focusout="pipeODCheck, storepipeOD()" type="number" min="0" step="0.01" required class="form-control border-success text-success" id="pipe-od" placeholder="OD" />
                        <label for="pipe-od">Pipe OD</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="store.mainInputs.pipeODConv(store.inputUnits.pipeODUnit)" v-model="store.inputUnits.pipeODUnit" class="form-select form-select-sm border-tertiary bg-body-tertiary">
                            <option>inch</option>
                            <option>mm</option>
                        </select>
                    </div>
                </div>
                

                <!-- Pipe ID -->
                <div class="d-flex align-items-baseline me-5">
                    <div class="form-floating mb-3 w-50">
                        <input v-model="store.mainInputs.pipeID" @focusout="pipeIDCheck, storePipeID()" type="number" min="0" step="0.01" required class="form-control border-success text-success" id="pipe-id" placeholder="ID" />
                        <label for="pipe-id">Pipe ID</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="store.mainInputs.pipeIDConv(store.inputUnits.pipeIDUnit)" v-model="store.inputUnits.pipeIDUnit" class="form-select form-select-sm border-tertiary bg-body-tertiary">
                            <option>inch</option>
                            <option>mm</option>
                        </select>
                    </div>
                </div>
                

                <!-- Pipe Length -->
                <div class="d-flex align-items-baseline me-5">
                    <div class="form-floating mb-3 w-50">
                        <input @focusout="storePipeLength" v-model="store.mainInputs.pipeLength" type="number" min="0" step="1" required class="form-control border-success text-success" id="pipe-length" placeholder="Length" />
                        <label for="pipe-length">Pipe Length</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="store.mainInputs.pipeLengthConv(store.inputUnits.pipeLengthUnit)" v-model="store.inputUnits.pipeLengthUnit" class="form-select form-select-sm border-tertiary bg-body-tertiary">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>
                

            </div>
    </div>
</template>

<style scoped>
.well-data select {
    font-size: 12px;
    width: 80px;
}

input {
    font-weight: 500;
}

</style>
