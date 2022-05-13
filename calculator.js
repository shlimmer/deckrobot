    $(document).ready(function () {
        var userCostInput = $('#user_cost');
        var percentInput = $('#percent');
        var employeesInput = $('#employees');
        var productivityInput = $('#productivity');
        
        userCostInput.inputmask("$ (,999){+|1}", {
            positionCaretOnClick: "radixFocus",
            radixPoint: ",",
            autoUnmask: true,
            _radixDance: true,
            numericInput: true,
            definitions: {
                "0": {
                    validator: "[0-9\uFF11-\uFF19]"
                }
            }
        });
        percentInput.inputmask('9[9][9]%');
        employeesInput.inputmask("(,999){+|1}", {
            positionCaretOnClick: "radixFocus",
            radixPoint: ",",
            _radixDance: true,
            autoUnmask: true,
            numericInput: true,
            definitions: {
                "0": {
                    validator: "[0-9\uFF11-\uFF19]"
                }
            }
        });
        productivityInput.inputmask('9[9][9]%');
       
        google.charts.load('current', {'packages':['corechart']});
        
        var chartTime, chartTimeSaved;
        function drawChart() {
            chartTime = new google.visualization.PieChart(document.getElementById('time_wrapper'));
            chartTimeSaved = new google.visualization.PieChart(document.getElementById('time_saved_wrapper'));
            drawTime();
            drawTimeSaved();
        }
        
        function productChange(value) {
            if (value) {
                var intValue = parseInt(value, 10);
                if (intValue < 0) {
                    showError('productivity', 'Productivity can not be less than zero');
                } else if (intValue > 100) {
                    showError('productivity', 'Productivity can not be more than 100%');
                } else {
                    showError('productivity', '');
                    drawTimeSaved();
                }
            } else {
                showError('productivity', 'Productivity can not be empty');
            }
        }
        function percentChange(value) {
            if (value) {
                var intValue = parseInt(value, 10);
                if (intValue < 0) {
                    showError('percent', 'Percentage can not be less than zero');
                } else if (intValue > 100) {
                    showError('percent', 'Percentage can not be more than 100%');
                } else {
                    showError('percent', '');
                    drawTime();
                }
            } else {
                showError('percent', 'Percentage can not be empty');
            }
        }
        
        productivityInput.on('keyup', function (evt) {
            setTimeout(function () {
                productChange(evt.target.value);
            }, 0);
        });
        percentInput.on('keyup', function (evt) {
            setTimeout(function () {
                percentChange(evt.target.value);
            }, 0);
        });
        $('input').on('keyup', calculate);
        
        function drawTimeSaved() {
            var value = parseInt(productivityInput.val(), 10);
            var angle = value * (360/100);
            var winWidth = $(window).width();
            var size;
            
            if (winWidth > 1370) {
                size = 160;
            } else if (winWidth > 1024) {
                size = 120;
            } else if (winWidth > 400) {
                size = 140;
            } else {
                size = 120;
            }
            
            var data = google.visualization.arrayToDataTable([
                ['Rest of your time', 'Time spent on ppt'],
                ['Rest of your time', 100 - value],
                ['Time spent on ppt', value]
            ]);
            chartTimeSaved.draw(data, {
                width: size + (size > 120 ? 40 : 0),
                height: size,
                legend: 'none',
                pieSliceText: 'percentage',
                pieSliceTextStyle: {
                    color: 'transparent'
                },
                animation:{
                    duration: 1000,
                    easing: 'out',
                },
                tooltip: { trigger: 'none' },
                chartArea: {
                    top: 0,
                    left: size > 120 ? 20 : 0,
                    width: size,
                    height: size
                },
                slices: [
                    {color: '#7F7F7F'},
                    {
                        color: '#30C7A1', 
                        textStyle: { 
                            'fontSize': 15,
                            'fontName': 'Roboto',
                            color: 'white'
                        }
                    },
                ],
                backgroundColor: 'transparent',
                pieSliceBorderColor : "transparent",
                pieStartAngle: angle
            })
        }
        
        function drawTime() {
            var value = parseInt(percentInput.val(), 10);
            var angle = value * (360/100);
            
            var winWidth = $(window).width();
            var size;
            
            if (winWidth > 1370) {
                size = 160;
            } else if (winWidth > 1024) {
                size = 120;
            } else if (winWidth > 400) {
                size = 140;
            } else {
                size = 120;
            }
            
            var data = google.visualization.arrayToDataTable([
                ['Rest of your time', 'Time spent on ppt'],
                ['Rest of your time', 100 - value],
                ['Time spent on ppt', value]
            ]);
            chartTime.draw(data, {
                width: size + (size > 120 ? 40 : 0),
                height: size,
                legend: 'none',
                pieSliceText: 'percentage',
                pieSliceTextStyle: {
                    color: 'transparent'
                },
                animation:{
                    duration: 1000,
                    easing: 'out',
                },
                tooltip: { trigger: 'none' },
                chartArea: {
                    top: 0,
                    left: size > 120 ? 20 : 0,
                    width: size,
                    height: size
                },
                slices: [
                    {color: '#8176D6'},
                    {
                        color: '#FF731C', 
                        textStyle: { 
                            'fontSize': 15,
                            'fontName': 'Roboto',
                            color: 'white'
                        }
                    },
                ],
                backgroundColor: 'transparent',
                pieSliceBorderColor : "transparent",
                pieStartAngle: angle
            });
        }
        
        google.charts.setOnLoadCallback(drawChart);
        
        var errors = [ ];
        function showError(key, value) {
            var html = '';
            var isFound = false;
            for (var i = 0, l = errors.length; i < l; i++) {
                if (errors[i].key === key) {
                    errors[i].message = value;
                    isFound = true;
                }
                if (errors[i].message) {
                    html += '<div class="error">' + errors[i].message + '</div>';
                }
            }
            if (!isFound) {
                if (value) {
                    html += '<div class="error">' + value + '</div>';
                }
                errors.push({
                    key: key,
                    message: value
                });
            }
            $('#errors_wrapper').html(html);
        }
        function formatMoney(x) {
            if (x > 1000000) {
                x = Math.round(x / 10000) / 100 + ' M';
            } else {
                x = Math.round(x).toString();
            }
            return '$ ' + x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");          
        };
        function drawBars(annualValue, investValue) {
            var winWidth = $(window).width();
            var isHalf = (winWidth < 1370) && (winWidth > 1024);
            var maxWidth = $('#parent_row').width() - 400 - (isHalf ? 400 : 0);
            console.log(maxWidth)
            var lagerBar = (annualValue > investValue) ? $('#annual_bar') : $('#invest_bar');
            var smallerBar = (annualValue < investValue) ? $('#annual_bar') : $('#invest_bar');
            var k = Math.min(annualValue / investValue, investValue / annualValue);
            
            lagerBar.css({ width: maxWidth + 'px' });
            smallerBar.css({ width: maxWidth * k + 'px'});
            
            $('#annual_bar_value').html(formatMoney(annualValue));
            $('#invest_bar_value').html(formatMoney(investValue));
        }
        function calculate() {
            var userCost = parseInt(userCostInput.val(), 10);
            var percent = parseInt(percentInput.val(), 10) / 100;
            var employees = parseInt(employeesInput.val(), 10);
            var productivity = parseInt(productivityInput.val(), 10) / 100;
            
            if (employees) {
                var value = 60 * employees * 12;
                $('#invest_value').html(formatMoney(value));
                
            } else {
                $('#invest_value').html('#########');
                $('#invest_bar_value').html('#########');
            }
            if (percent && productivity) {
                var value = percent * productivity * 220 / 5;
                $('#saves_value').html(Math.round(value * 100) / 100);
            } else {
                $('#saves_value').html('#########');
            }
            if (percent && productivity && userCost && employees) {
                var value = percent * productivity * userCost * employees;
                $('#eq_value').html(formatMoney(value));
                $('#annual_value').html(formatMoney(value - 60 * employees * 12));
                $('#roi_value').html(Math.round((value - 60 * employees * 12) * 100 / (198 * employees)) + '%');
                drawBars(value - 60 * employees * 12, 60 * employees * 12);
            } else {
                $('#eq_value').html('#########');
                $('#annual_value').html('#########');
                $('#annual_bar_value').html('#########');
                $('#roi_value').html('#########');
            }
        }
        calculate();
        $(window).on('resize', function () {
            calculate();
            percentChange(percentInput.val());
            productChange(productivityInput.val());
        })
    });
