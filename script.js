// script.js
document.addEventListener('DOMContentLoaded', () => {
    const budgetSelect = document.getElementById('budget');
    const purposeSelect = document.getElementById('purpose');
    const fuelTypeSelect = document.getElementById('fuelType');
    const transmissionSelect = document.getElementById('transmission');
    const getSuggestionsBtn = document.getElementById('getSuggestions');
    const suggestionsListDiv = document.getElementById('suggestionsList');
    const errorMessageDiv = document.getElementById('errorMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const restartBtn = document.getElementById('restartBtn');

    function getSuggestions() {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
        suggestionsListDiv.innerHTML = '';
        loadingSpinner.style.display = 'block';
        restartBtn.classList.add('hidden');

        const budget = budgetSelect.value;
        const purpose = purposeSelect.value;
        const fuelType = fuelTypeSelect.value;
        const transmission = transmissionSelect.value;

        if (!budget || !purpose || !fuelType || !transmission) {
            loadingSpinner.style.display = 'none';
            errorMessageDiv.textContent = 'Please fill in all fields.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        if (fuelType === 'electric' && transmission !== 'automatic') {
            loadingSpinner.style.display = 'none';
            errorMessageDiv.textContent = 'Electric cars only have automatic transmission.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            let suggestions = [];

            if (fuelType === 'electric') {
                if (budget === 'low') suggestions = ['Renault Zoe', 'Nissan Leaf'];
                else if (budget === 'medium') suggestions = ['Hyundai Kona Electric', 'MG4 EV'];
                else if (budget === 'high') suggestions = ['Tesla Model 3', 'BMW i4'];
            } else if (fuelType === 'petrol') {
                if (purpose === 'city') suggestions = ['Fiat Egea', 'Peugeot 208'];
                else if (purpose === 'family') suggestions = ['Toyota Corolla', 'Honda Civic'];
                else if (purpose === 'off-road') suggestions = ['Suzuki Vitara', 'Jeep Compass'];
                else if (purpose === 'sport') suggestions = ['Mazda MX-5', 'Ford Mustang'];
            } else if (fuelType === 'diesel') {
                if (purpose === 'city') suggestions = ['Volkswagen Polo TDI', 'Renault Megane Diesel'];
                else if (purpose === 'family') suggestions = ['Skoda Superb Diesel', 'Ford Mondeo TDCi'];
                else if (purpose === 'off-road') suggestions = ['Dacia Duster Diesel', 'Land Rover Freelander'];
                else if (purpose === 'sport') suggestions = ['BMW 320d', 'Audi A5 TDI'];
            }

            if (suggestions.length === 0) {
                suggestions = ['Generic Safe Choice: Volkswagen Golf'];
            }

            suggestions.forEach(car => {
                const p = document.createElement('p');
                p.textContent = car;
                suggestionsListDiv.appendChild(p);
            });

            restartBtn.classList.remove('hidden');
        }, 800);
    }

    getSuggestionsBtn.addEventListener('click', getSuggestions);

    restartBtn.addEventListener('click', () => {
        budgetSelect.value = '';
        purposeSelect.value = '';
        fuelTypeSelect.value = '';
        transmissionSelect.value = '';
        suggestionsListDiv.innerHTML = '';
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
        restartBtn.classList.add('hidden');
    });

    fuelTypeSelect.addEventListener('change', () => {
        const value = fuelTypeSelect.value;
        transmissionSelect.innerHTML = '';

        if (value === 'electric') {
            const auto = document.createElement('option');
            auto.value = 'automatic';
            auto.textContent = 'Automatic';
            transmissionSelect.appendChild(auto);
        } else {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select Transmission';
            transmissionSelect.appendChild(defaultOption);

            ['automatic', 'manual'].forEach(val => {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val.charAt(0).toUpperCase() + val.slice(1);
                transmissionSelect.appendChild(opt);
            });
        }
    });
});
