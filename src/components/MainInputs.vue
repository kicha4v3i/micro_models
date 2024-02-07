<script setup>
import { onMounted, ref, watch } from 'vue'
import store from '../store/index.js'
import { supabase } from '../lib/supabaseClient.js'

// Load well information data
/*
const loadMainInputs = async() => {
    if (store.state.user) {
        // Bit Size
        try {
            let { data: bitSize, error } = await supabase.from('well_information').select('bit_size').eq('id',store.state.user.id)
            store.mainInputs.bitSize = bitSize[0].bit_size
            localStorage.setItem('bit_size', store.mainInputs.bitSize)

            if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Mud Weight
        try {
            let { data: mudWeight, error } = await supabase.from('well_information').select('mud_weight').eq('id',store.state.user.id)
            store.mainInputs.mw = mudWeight[0].mud_weight
        
            localStorage.setItem('mud_weight', store.mainInputs.mw)

            if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Flowrate
        try {
            let { data: flowrate, error } = await supabase.from('well_information').select('flowrate').eq('id',store.state.user.id)
            store.mainInputs.flowrate = flowrate[0].flowrate
           
            localStorage.setItem('flowrate', store.mainInputs.flowrate)
        if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Pipe OD
        try {
            let { data: pipeOD, error } = await supabase.from('well_information').select('pipe_od').eq('id',store.state.user.id)
            store.mainInputs.pipeOD = pipeOD[0].pipe_od
           
            localStorage.setItem('pipe_od', store.mainInputs.pipeOD)
        if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Pipe ID
        try {
            let { data: pipeID, error } = await supabase.from('well_information').select('pipe_id').eq('id',store.state.user.id)
            store.mainInputs.pipeID = pipeID[0].pipe_id
           
            localStorage.setItem('pipe_id', store.mainInputs.pipeID)
        if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Pipe Length
        try {
            let { data: pipeLength, error } = await supabase.from('well_information').select('pipe_length').eq('id',store.state.user.id)
            store.mainInputs.pipeLength = pipeLength[0].pipe_length
           
            localStorage.setItem('pipe_length', store.mainInputs.pipeLength)
        if (error) throw error
        } catch (error) {
            console.log(error.message)
        }
    }
    
}
*/
// Load Data when signed in

//window.onload = loadMainInputs()
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

onMounted(() => {
    //loadMainInputs()
    /*
    store.mainInputs.bitSize = localStorage.getItem('bit_size') || ''
    store.mainInputs.mw = localStorage.getItem('mud_weight') || ''
    store.mainInputs.flowrate = localStorage.getItem('flowrate') || ''
    store.mainInputs.pipeOD = localStorage.getItem('pipe_od') || ''
    store.mainInputs.pipeID = localStorage.getItem('pipe_id') || ''
    store.mainInputs.pipeLength = localStorage.getItem('pipe_length') || ''
    */
})

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
        <div class="inputs d-flex flex-column w-75">
                <!-- Bit Size -->
                <div class="input-group mb-4 w-100">
                    <div class="form-floating w-50">
                        <input @change="storeBitSize" v-model="store.mainInputs.bitSize" type="number" min="0" step="0.1" required class="form-control text-success border-success" placeholder="Bit Size">
                        <label for="bit-size">Bit Size</label>
                    </div>
                    <select @change="store.mainInputs.bitSizeConv(store.inputUnits.bitSizeUnit)" v-model="store.inputUnits.bitSizeUnit" class="form-select form-select-sm border-success bg-body-tertiary w-25">
                        <option>inch</option>
                        <option>mm</option>
                    </select>
                </div>
                
                <!-- Mud Weight -->
                <div class="input-group mb-4 w-100">
                    <div class="form-floating w-50">
                        <input @change="storeMudWeight" v-model="store.mainInputs.mw" type="number" min="0" step="0.01" required class="form-control text-success border-success" id="mud-weight" placeholder="Mud Weight">
                        <label for="mud-weight">Mud Weight</label>
                    </div>
                    <select @change="store.mainInputs.mwConv(store.inputUnits.mwUnit)" v-model="store.inputUnits.mwUnit" class="form-select form-select-sm border-success bg-body-tertiary w-25">
                        <option>ppg</option>
                        <option>g/cc</option>
                    </select>
                </div>

                <!-- Flowrate -->
                <div class="input-group mb-4 w-100">
                    <div class="form-floating w-50">
                        <input @focusout="storeFlowrate" v-model="store.mainInputs.flowrate" type="number" min="0" step="1" required class="form-control border-success text-success" id="flowrate" placeholder="Flowrate" />
                        <label for="flowrate">Flowrate</label>
                    </div>
                    <select @change="store.mainInputs.flowrateConv(store.inputUnits.flowrateUnit)" v-model="store.inputUnits.flowrateUnit" class="form-select form-select-sm border-success bg-body-tertiary w-25">
                        <option>gpm</option>
                        <option>lpm</option>
                    </select>
                </div>

                <!-- Pipe Dimensions -->
                <!-- Pipe OD -->
                <div class="input-group mb-4 w-100">
                    <div class="form-floating w-50">
                        <input v-model="store.mainInputs.pipeOD" @focusout="pipeODCheck, storepipeOD()" type="number" min="0" step="0.01" required class="form-control border-success text-success" id="pipe-od" placeholder="OD" />
                        <label for="pipe-od">Pipe OD</label>
                    </div>
                    <select @change="store.mainInputs.pipeODConv(store.inputUnits.pipeODUnit)" v-model="store.inputUnits.pipeODUnit" class="form-select form-select-sm border-success bg-body-tertiary w-25">
                        <option>inch</option>
                        <option>mm</option>
                    </select>
                </div>
                

                <!-- Pipe ID -->
                <div class="input-group mb-4 w-100">
                    <div class="form-floating w-50">
                        <input v-model="store.mainInputs.pipeID" @focusout="pipeIDCheck, storePipeID()" type="number" min="0" step="0.01" required class="form-control border-success text-success" id="pipe-id" placeholder="ID" />
                        <label for="pipe-id">Pipe ID</label>
                    </div>
                    <select @change="store.mainInputs.pipeIDConv(store.inputUnits.pipeIDUnit)" v-model="store.inputUnits.pipeIDUnit" class="form-select form-select-sm border-success bg-body-tertiary w-25">
                        <option>inch</option>
                        <option>mm</option>
                    </select>
                </div>
                

                <!-- Pipe Length -->
                <div class="input-group mb-4 w-100">
                    <div class="form-floating w-50">
                        <input @focusout="storePipeLength" v-model="store.mainInputs.pipeLength" type="number" min="0" step="1" required class="form-control border-success text-success" id="pipe-length" placeholder="Length" />
                        <label for="pipe-length">Pipe Length</label>
                    </div>
                    <select @change="store.mainInputs.pipeLengthConv(store.inputUnits.pipeLengthUnit)" v-model="store.inputUnits.pipeLengthUnit" class="form-select form-select-sm border-success bg-body-tertiary w-25">
                        <option>ft</option>
                        <option>m</option>
                    </select>
                </div>

            </div>
    </div>
</template>

<style scoped>
*{
    box-sizing: border-box;
}
.well-data {
    width: 350px;
}

.well-data .inputs {
    width: 400px;
}
.well-data select {
    font-size: 12px;
    width: 80px;
}

input {
    font-weight: 500;
}

.bit-input {
    width: 10px;
}
</style>
