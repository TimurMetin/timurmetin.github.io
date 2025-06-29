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
            const formSection = document.querySelector('.form-section');

            // Variable to hold recommended cars (as per logical statements)
            let suggestionList = [];

            // Function to get suggestions based on inputs
            function getCarSuggestions() {
                // Clear previous messages and suggestions
                errorMessageDiv.textContent = '';
                errorMessageDiv.style.display = 'none';
                suggestionsListDiv.innerHTML = '';
                suggestionList = []; // Reset the suggestion list

                const budget = budgetSelect.value;
                const purpose = purposeSelect.value;
                const fuelType = fuelTypeSelect.value;
                const transmission = transmissionSelect.value;

                // Show loading spinner
                loadingSpinner.style.display = 'block';
                getSuggestionsBtn.disabled = true; // Disable button during loading

                // Simulate a delay for visual feedback (e.g., fetching data)
                setTimeout(() => {
                    // Hide loading spinner
                    loadingSpinner.style.display = 'none';
                    getSuggestionsBtn.disabled = false; // Re-enable button

                    // --- Logical Statements / Flowchart Logic: IF all inputs are filled ---
                    if (!budget || !purpose || !fuelType || !transmission) {
                        // ELSE show error message
                        errorMessageDiv.textContent = 'Please fill in all fields.';
                        errorMessageDiv.style.display = 'block';
                        restartBtn.classList.add('hidden');
                        return;
                    }

                    // --- Filter and show a matching car list (Examples from your prompt) ---

                    // City Cars
                    if (budget === 'low' && purpose === 'city') {
                        suggestionList = ['Fiat Egea', 'Renault Clio'];
                    } else if (budget === 'medium' && purpose === 'city') {
                        suggestionList = ['Honda Civic', 'Toyota Corolla'];
                    } else if (budget === 'high' && purpose === 'city') {
                        suggestionList = ['Mercedes-Benz A-Class', 'Audi A3'];
                    }

                    // Family Cars
                    else if (budget === 'low' && purpose === 'family') {
                        suggestionList = ['Dacia Duster', 'Skoda Octavia'];
                    } else if (budget === 'medium' && purpose === 'family') {
                        suggestionList = ['Volkswagen Passat', 'Ford Kuga'];
                    } else if (budget === 'high' && purpose === 'family') {
                        suggestionList = ['BMW 3 Series Touring', 'Audi Q5'];
                    }

                    // Off-road Cars
                    else if (budget === 'low' && purpose === 'off-road') {
                        suggestionList = ['Suzuki Jimny', 'Lada Niva'];
                    } else if (budget === 'medium' && purpose === 'off-road') {
                        suggestionList = ['Jeep Wrangler', 'Subaru Forester'];
                    } else if (budget === 'high' && purpose === 'off-road') {
                        suggestionList = ['Land Rover Defender', 'Toyota Land Cruiser'];
                    }

                    // Sport Cars
                    else if (budget === 'low' && purpose === 'sport') {
                        suggestionList = ['Mazda MX-5', 'Subaru BRZ'];
                    } else if (budget === 'high' && purpose === 'sport' && transmission === 'automatic') {
                        suggestionList = ['BMW M4', 'Porsche 911'];
                    } else if (budget === 'high' && purpose === 'sport' && transmission === 'manual') {
                        suggestionList = ['Ford Mustang GT', 'Chevrolet Camaro SS'];
                    } else if (budget === 'medium' && purpose === 'sport') {
                        suggestionList = ['Ford Focus ST', 'Hyundai i30 N'];
                    }

                    // If no specific match, provide a general message or empty list
                    if (suggestionList.length === 0) {
                        suggestionsListDiv.innerHTML = '<p>No specific recommendations found for your selection. Try different combinations!</p>';
                    } else {
                        suggestionList.forEach(car => {
                            const p = document.createElement('p');
                            p.textContent = car;
                            suggestionsListDiv.appendChild(p);
                        });
                    }

                    // Show restart button
                    restartBtn.classList.remove('hidden');
                }, 1000); // 1-second delay
            }

            // Event listener for the "Get Suggestions" button
            getSuggestionsBtn.addEventListener('click', getCarSuggestions);

            // Event listener for the "Restart" button
            restartBtn.addEventListener('click', () => {
                // Reset all selects to their default "Select..." option
                budgetSelect.value = '';
                purposeSelect.value = '';
                fuelTypeSelect.value = '';
                transmissionSelect.value = '';

                // Clear results and hide restart button
                suggestionsListDiv.innerHTML = '';
                errorMessageDiv.textContent = '';
                errorMessageDiv.style.display = 'none';
                restartBtn.classList.add('hidden');
                loadingSpinner.style.display = 'none'; // Ensure spinner is hidden on restart
            });
        });
