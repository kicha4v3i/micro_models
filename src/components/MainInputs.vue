<script setup>
import { onMounted, ref, watch } from 'vue'
import store from '../store/index.js'
import { supabase } from '../lib/supabaseClient.js'


// Units
const mwUnit = ref('ppg')
const bitSizeUnit = ref('inch')
const flowrateUnit = store.inputUnits.flowrateUnit
const pipeODUnit = ref('inch')
const pipeIDUnit = ref('inch')
const pipeLengthUnit = ref('ft')

// Load well information data
const loadMainInputs = async() => {
    if (store.state.user) {
        // User ID
        try {
            let { data: user_id, error } = await supabase.from('well_information').select('id')
            store.userData.userId = user_id[0].id
            if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Bit Size
        try {
            let { data: bitSize, error } = await supabase.from('well_information').select('bit_size')
            store.mainInputs.bitSize = bitSize[0].bit_size
            localStorage.setItem('bit_size', store.mainInputs.bitSize)

            if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Mud Weight
        try {
            let { data: mudWeight, error } = await supabase.from('well_information').select('mud_weight')
            store.mainInputs.mw = mudWeight[0].mud_weight
        
            localStorage.setItem('mud_weight', store.mainInputs.mw)

            if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Flowrate
        try {
            let { data: flowrate, error } = await supabase.from('well_information').select('flowrate')
            store.mainInputs.flowrate = flowrate[0].flowrate
           
            localStorage.setItem('flowrate', store.mainInputs.flowrate)
        if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Pipe OD
        try {
            let { data: pipeOD, error } = await supabase.from('well_information').select('pipe_od')
            store.mainInputs.pipeOD = pipeOD[0].pipe_od
           
            localStorage.setItem('pipe_od', store.mainInputs.pipeOD)
        if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Pipe ID
        try {
            let { data: pipeID, error } = await supabase.from('well_information').select('pipe_id')
            store.mainInputs.pipeID = pipeID[0].pipe_id
           
            localStorage.setItem('pipe_id', store.mainInputs.pipeID)
        if (error) throw error
        } catch (error) {
            console.log(error.message)
        }

        // Pipe Length
        try {
            let { data: pipeLength, error } = await supabase.from('well_information').select('pipe_length')
            store.mainInputs.pipeLength = pipeLength[0].pipe_length
           
            localStorage.setItem('pipe_length', store.mainInputs.pipeLength)
        if (error) throw error
        } catch (error) {
            console.log(error.message)
        }
    }
    
}

// On Load
window.onload = loadMainInputs()

onMounted(() => {
    store.mainInputs.bitSize = localStorage.getItem('bit_size') || ''
    store.mainInputs.mw = localStorage.getItem('mud_weight') || ''
    store.mainInputs.flowrate = localStorage.getItem('flowrate') || ''
    store.mainInputs.pipeOD = localStorage.getItem('pipe_od') || ''
    store.mainInputs.pipeID = localStorage.getItem('pipe_id') || ''
    store.mainInputs.pipeLength = localStorage.getItem('pipe_length') || ''
    addID()
})


// Store Well Information Data
/* Add id in database */
const addID = async() => {
    const { data: { user } } = await supabase.auth.getUser()
    let { data: user_id, error1 } = await supabase.from('well_information').select('id')
    if (user_id == null || user_id == '') {
        const { data, error } = await supabase.from('well_information').insert([
            {
                id: user.id
            }
        ])
    }
}


const storeBitSize = async() => {
    try {
        // Check if block executed
        console.log('id', store.userData.userId)
        console.log(store.state.user.id)
        
        // If new data, then create a new row of data
        if (store.userData.userId == null) {
            console.log('Data Added')
            const { data, error } = await supabase.from('well_information').insert([
                {   
                    id: store.state.user.id,
                    bit_size: store.mainInputs.bitSize,
                }
            ])

            // Store in local storage
            localStorage.setItem('bit_size', store.mainInputs.bitSize)
            if (error) throw error
        } else {
            // If update data, then update
            console.log('Data Updated')
            const { data, error } = await supabase.from('well_information').update({ bit_size: store.mainInputs.bitSize }).eq('id', store.state.user.id).select()
            localStorage.setItem('bit_size', store.mainInputs.bitSize)
            if (error) throw error
        }
        
    } catch (error) {
        console.log('error', error.message)
    }
}

const storeMudWeight = async() => {
    try {
        // If new data, then create data
        if (store.userData.userId == null) {
            console.log('Data Added')
            const { data, error } = await supabase.from('well_information').insert([
                {   
                    id: store.state.user.id,
                    mud_weight: store.mainInputs.mw,
                }
            ])
            if (error) throw error
            //Store in local storage
            localStorage.setItem('mud_weight', store.mainInputs.mw)
        } else {
            // Update data otherwise
            console.log('Data Updated')
            const { data, error } = await supabase.from('well_information').update({ mud_weight: store.mainInputs.mw }).eq('id', store.state.user.id).select()
            if (error) throw error
            
            //Store in local storage
        }
        
    } catch (error) {
        console.log('error', error.message)
    }
}

const storeFlowrate = async() => {
    try {
        if (store.userData.userId == null) {
            console.log('Flowrate Added')
            const { data, error } = await supabase.from('well_information').insert([
                {   
                    id: store.state.user.id,
                    flowrate: store.mainInputs.flowrate,
                }
            ])
            if (error) throw error
        } else {
            console.log('Flowrate Updated')
            const { data, error } = await supabase.from('well_information').update({ flowrate: store.mainInputs.flowrate }).eq('id', store.state.user.id).select()
            if (error) throw error
        }
    } catch (error) {
            console.log(error.message)
    }
}

const storepipeOD = async() => {
    try {
        if (store.userData.userId == null) {
            console.log('Pipe OD added')
            const { data, error } = await supabase.from('well_information').insert([
                {   
                    id: store.state.user.id,
                    pipe_od: store.mainInputs.pipeOD,
                }
            ])
            if (error) throw error
        } else {
            console.log('Pipe OD Updated')
            const { data, error } = await supabase.from('well_information').update({ pipe_od: store.mainInputs.pipeOD }).eq('id', store.state.user.id).select()
            if (error) throw error
        }
    } catch (error) {
            console.log(error.message)
    }
}

const storePipeID = async() => {
    try {
        if (store.userData.userId == null) {
            console.log('Pipe ID added')
            const { data, error } = await supabase.from('well_information').insert([
                {   
                    id: store.state.user.id,
                    pipe_id: store.mainInputs.pipeID,
                }
            ])
            if (error) throw error
        } else {
            console.log('Pipe ID Updated')
            const { data, error } = await supabase.from('well_information').update({ pipe_id: store.mainInputs.pipeID }).eq('id', store.state.user.id).select()
            if (error) throw error
        }
    } catch (error) {
            console.log(error.message)
    }
}

const storePipeLength = async() => {
    try {
        if (store.userData.userId == null) {
            console.log('Pipe Length added')
            const { data, error } = await supabase.from('well_information').insert([
                {   
                    id: store.state.user.id,
                    pipe_length: store.mainInputs.pipeLength,
                }
            ])
            if (error) throw error
        } else {
            console.log('Pipe Length Updated')
            const { data, error } = await supabase.from('well_information').update({ pipe_length: store.mainInputs.pipeLength }).eq('id', store.state.user.id).select()
            if (error) throw error
        }
        localStorage.setItem('pipe_length', store.mainInputs.pipeLength)
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