const newtonRaphson = (f_x,f_dx,x_o, iterations=100, tol=0.00001) => {
    let x_1
    for (let i=0; i<=iterations; i++) {

        x_1 = x_o - f_x / f_dx

        if (Math.abs(x_1 - x_o) <= tol) {
            return x_1
        } else {
            x_o = x_1
        }

        if (i == iterations && Math.abs(x_1 - x_o) > tol) {
            throw 'Iterations could not converge to the solution. Increase number of iterations or change x_o and try again'
        }
    }
}

export default {
    newtonRaphson
}