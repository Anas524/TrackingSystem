$(document).ready(function () {
    // Event listener for the close button using jQuery
    $('#closeBtn').click(function () {
        closeLoginBox(); // Call the function to close the login box
    });

    // Event listener for the login form submission
    $('#loginForm').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        // Simulate a login check (replace this with your actual authentication logic)
        if (email && password) {
            $('#loginMessage').text("Login successfully!").show();

            // Automatically close the login box after 1 second
            setTimeout(function () {
                closeLoginBox(); // Call the function to close the login box
            }, 1000);
        } else {
            $('#loginMessage').text("Please enter email and password.").show();
        }
    });
});

// Function to open the login box
function openLoginBox() {
    $('#loginBox').css('display', 'flex');
}

// Function to close the login box
function closeLoginBox() {
    $('#loginBox').hide();
    $('#loginMessage').hide(); // Hide the message when closing
}

// Ensure the scrollbar is always at the top on page load
window.onload = function() {
    setTimeout(function() {
        window.scrollTo(0, 0); // Scroll to the top after the page is loaded
    }, 0);
};

//common reveal options to create reveal animations
ScrollReveal({ 
    reset: true,
    distance: '60px',
    duration: 2500,
    delay: 400 
});

//target elements, and specify options to create reveal animations
ScrollReveal().reveal('.main-title, .section-title', { delay: 500, origin: 'left' });
ScrollReveal().reveal('.sec-01 .image, .info', { delay: 600, origin: 'bottom' });
ScrollReveal().reveal('.text-box, .mapview-button, .win-para0', { delay: 700, origin: 'right' });
ScrollReveal().reveal('.media-icons i', { delay: 500, origin: 'bottom', interval: 200 });
ScrollReveal().reveal('.sec-02 .image, .sec-03 .image, .map-container', { delay: 500, origin: 'top' });
ScrollReveal().reveal('.media-info li, .tracking-panel', { delay: 500, origin: 'left', interval: 200 });

$(document).ready(function() {
    // Click event for "about us"
    $('#whoAreWeLink, #02').on('click', function(e) {
        e.preventDefault(); // Prevent the default anchor behavior

        // Immediately scroll to the sec-01 section
        $('html, body').scrollTop($('.sec-01').offset().top);
        
    });
});

$(document).ready(function() {
    $('#servicesLink, #03, .goSec-02').on('click', function(e) {
        e.preventDefault();
        $('html, body').scrollTop($('.sec-02').offset().top);
    })
})

$(document).ready(function() {
    $('#04').on('click', function(e) {
        e.preventDefault();
        $('html, body').scrollTop($('.sec-04').offset().top);
    })
})

$(document).ready(function() {
    $('#contactUsLink, #05').on('click', function(e) {
        e.preventDefault();
        $('html, body').scrollTop($('.sec-03').offset().top);
    })
})

$(document).ready(function() {
    $('#mapview-buttonLink').on('click', function(e) {
        e.preventDefault();
        $('html, body').scrollTop($('.sec-04').offset().top);
    })
}
)

$(document).ready(function() {
    $('#track-button').on('click', function(e) {
        e.preventDefault();
        $('html, body').scrollTop($('.sec-04').offset().top);
    })
})

// Initialize the map with default view
var map = L.map('map').setView([26.395769, 43.873886], 4); // Default location view

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Update status message in the UI
function updateStatus(message) {
    $('#status').text(message);
}

// Function to show current location on map
function showCurrentLocation(position) {
    var userLatLng = [position.coords.latitude, position.coords.longitude]; // Get user's latitude and longitude
    map.setView(userLatLng, 13); // Center the map at the user's location

    // Create a marker at the user's location
    var marker = L.marker(userLatLng).addTo(map)
        .bindPopup('You are here!')
        .openPopup();

    // Update tracking status
    updateStatus('You are here!');

    // Add click event to the marker to update the Location Name field
    marker.on('click', function() {
        $('#location-name').val('You are here!');
    });
}

// Function to handle geolocation errors
function handleGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('Geolocation access denied. Please allow location access in your browser settings.');
            updateStatus('Location access denied.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            updateStatus('Location unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get your location timed out.');
            updateStatus('Location request timed out.');
            break;
        default:
            alert('An unknown error occurred.');
            updateStatus('Unknown error.');
            break;
    }
}

// Get the user's current location
if (navigator.geolocation) {
    updateStatus('Attempting to get your location...');
    navigator.geolocation.getCurrentPosition(showCurrentLocation, handleGeolocationError);
} else {
    alert('Geolocation is not supported by your browser.');
    updateStatus('Geolocation not supported.');
}

// Event listener for tracking specific locations
$('#track-button').on('click', function(event) {
    event.preventDefault(); // Prevent form submission
    var locationName = $('#location-name').val();

    // Use the Nominatim API to get latitude and longitude from the location name
    $.ajax({
        url: 'https://nominatim.openstreetmap.org/search',
        method: 'GET',
        data: {
            q: locationName,
            format: 'json',
            addressdetails: 1,
            limit: 1
        },
        success: function(data) {
            if (data.length > 0) {
                var lat = data[0].lat; // Get latitude
                var lng = data[0].lon; // Get longitude

                // Create a new marker for the entered location
                var marker = L.marker([lat, lng]).addTo(map)
                    .bindPopup(locationName)
                    .openPopup();

                // Center the map on the new marker
                map.setView([lat, lng], 13);

                // Update tracking status
                updateStatus('Location Found: ' + locationName);

                // Add click event to the marker to update the Location Name field
                marker.on('click', function() {
                    $('#location-name').val(locationName); // Update input field when marker is clicked
                    updateStatus('Selected: ' + locationName); // Update status
                });
            } else {
                alert('Location not found. Please try another name.');
                updateStatus('Idle');
            }
        },
        error: function() {
            alert('Error retrieving location data. Please try again.');
            updateStatus('Idle');
        }
    });
});

// Add click event listener for reverse geocoding
map.on('click', function(e) {
    var lat = e.latlng.lat; // Get latitude of the clicked point
    var lng = e.latlng.lng; // Get longitude of the clicked point

    // Use Nominatim API to reverse-geocode the clicked point
    $.ajax({
        url: 'https://nominatim.openstreetmap.org/reverse',
        method: 'GET',
        data: {
            lat: lat,
            lon: lng,
            format: 'json'
        },
        success: function(data) {
            if (data && data.display_name) {
                var locationName = data.display_name; // Get location name
                $('#location-name').val(locationName); // Update the input field with the location name
                updateStatus('Location Selected: ' + locationName);

                // Create a marker at the clicked location
                var marker = L.marker([lat, lng]).addTo(map)
                    .bindPopup(locationName)
                    .openPopup();

                // Center the map on the clicked point
                map.setView([lat, lng], 13);

                // Add click event to the marker to update the Location Name field
                marker.on('click', function() {
                    $('#location-name').val(locationName); // Update input field when marker is clicked
                    updateStatus('Selected: ' + locationName); // Update status
                });
            } else {
                alert('Unable to retrieve location name. Please try again.');
                updateStatus('Idle');
            }
        },
        error: function() {
            alert('Error retrieving location data. Please try again.');
            updateStatus('Idle');
        }
    });
});

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80, // Adjust particle count
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff" // White particle color
        },
        "shape": {
            "type": "circle", // Shape of particles
            "stroke": {
                "width": 0,
                "color": "#000000"
            }
        },
        "opacity": {
            "value": 0.5, // Particle transparency
            "random": false,
            "anim": {
                "enable": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150, // Distance for linking particles
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6, // Adjust speed
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse" // Interaction mode (push particles away)
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            }
        },
        "modes": {
            "repulse": {
                "distance": 100, // Repulse distance on hover
                "duration": 0.4
            }
        }
    },
    "retina_detect": true
});

$(document).ready(function() {
    const header = $('header');

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) { // Check if scrolled more than 300 pixels
            header.addClass('scrolled'); // Add class to slide down and change background
        } else {
            header.removeClass('scrolled'); // Remove class to hide
        }
    });
})

$(document).ready(function() {
    // Handle click on 'Call Us' in media-info
    $('.media-info li:first-child').on('click', function() {
        // Show the menu bar and reveal the first list item (Call Us)
        $('.menu-bar').addClass('active'); // Show the menu-bar
        $('.menu-bar li').removeClass('show'); // Hide all items
        $('.menu-bar li:first-child').addClass('show'); // Show only the first list item
    });

    // Example for other items (like 'Media Inquiries')
    $('.media-info li:nth-child(2)').on('click', function() {
        // Show the menu-bar and reveal the second list item (Media Inquiries)
        $('.menu-bar').addClass('active');
        $('.menu-bar li').removeClass('show');
        $('.menu-bar li:nth-child(2)').addClass('show');
    });
    
    $('.media-info li:nth-child(3)').on('click', function() {
        // Show the menu-bar and reveal the second list item (Media Inquiries)
        $('.menu-bar').addClass('active');
        $('.menu-bar li').removeClass('show');
        $('.menu-bar li:nth-child(3)').addClass('show');
    });

    $('.media-info li:nth-child(4)').on('click', function() {
        // Show the menu-bar and reveal the second list item (Media Inquiries)
        $('.menu-bar').addClass('active');
        $('.menu-bar li').removeClass('show');
        $('.menu-bar li:nth-child(4)').addClass('show');
    });

    $('.media-info li:nth-child(5)').on('click', function() {
        // Show the menu-bar and reveal the second list item (Media Inquiries)
        $('.menu-bar').addClass('active');
        $('.menu-bar li').removeClass('show');
        $('.menu-bar li:nth-child(5)').addClass('show');
        $('.menu-bar li:nth-child(6)').addClass('show');
    });

    // Close the menu when the X button is clicked
    $('.close-menu').on('click', function() {
        $('.menu-bar').removeClass('active'); // Hide the menu-bar
    });

    $(window).on('scroll', function() {
        var sec03Offset = $('.sec-03').offset().top; // Get the top position of sec-03
        var scrollPosition = $(window).scrollTop(); // Get current scroll position
        var sec03Height = $('.sec-03').height(); // Get height of sec-03

        // Check if scrolled past sec-03
        if (scrollPosition > (sec03Offset + sec03Height) || scrollPosition < sec03Offset) {
            $('.menu-bar').removeClass('active'); // Close the menu-bar
        }
    });
});

$(document).ready(function() {
    // Popup text for each link
    const popupContent = {
        'terms': 'By using this website, you agree to comply with all applicable laws and regulations.',
        'privacy': 'We value your privacy and are committed to protecting your personal information.',
        'sitemap': 'At the bottom of the page, it provides a structured layout of main sections for easy navigation.'
    };

    // Show popup on click
    $('.footer-popup').on('click', function() {
        const linkId = $(this).attr('id');
        const popupText = popupContent[linkId];
        
        $('#popup-text').text(popupText);
        $('#popup-box').css({
            'display': 'block',
            'top': $(this).offset().top - 50 + 'px', // Positioning popup above the link
            'left': $(this).offset().left + 'px'
        });
    });

    // Close popup when moving cursor away
    $('.footer-popup').on('mouseleave', function() {
        $('#popup-box').hide();
    });
});

$(document).ready(function() {
    $('#homeLink').on('click', function(event) {
        event.preventDefault(); // Prevent default link behavior

        // Get the position of the Home link
        const homeLink = $(this);
        const popupMessage = $('#popupMessage');

        // Check if the scrollbar is at the top
        if ($(window).scrollTop() === 0) {
            // Show the popup message
            const offset = homeLink.offset();
            popupMessage.css({
                display: 'block',
                opacity: '1', // Make it visible
                top: offset.top + homeLink.outerHeight(), // Position below the link
                left: offset.left - 50 // Decrease by 50 pixels (adjust this value as needed)
            });

            // Hide the popup after a few seconds
            setTimeout(function() {
                popupMessage.css('opacity', '0'); // Fade out
                setTimeout(function() {
                    popupMessage.css('display', 'none'); // Hide completely after fade out
                }, 300); // Match the duration of the transition
            }, 1000); // Show for 1 seconds
        } else {
            // Scroll to the top of the page
            $('html, body').animate({ scrollTop: 0 }, 'smooth');
        }
    });
});