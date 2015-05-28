requirejs.config({
    baseUrl: 'static/js/vendor',
    paths: {
        app: '../'
    }
});


requirejs(['fastclick.min', 'cola', 'zepto.min'],
    function(FastClick, Cola, Zepto) {
        'use strict';
        //fastclick, disenble 300ms delay
        FastClick.attach(document.body);

        var name; //global var [name which user input]
        var currentEntity = 'Thing', //root
            currentFigureKey = null, //those different, entitykey is entity, but figureKey is entity or question
            currentIsObject = false,
            currentYesKey = 'bro',
            currentNopeKey = 'sister';

        window.Waves.displayEffect();
        $('#readyButton').click(function(event) {
            var inputname = $('#nameinput').val();
            if (inputname === null || inputname === undefined || inputname === '') {
                $('#welcometext').css('color', '#78C0A8');
                $('#welcometext').addClass('animated bounce');
            } else {
                name = inputname;
                $('#welcometext').addClass('animated bounceOutDown');
                setTimeout(function() {
                    $('#welcome').hide();
                    $('#pretip').show();
                    setTimeout(function() {
                        $('#reciprocal').html(2);
                        setTimeout(function() {
                            $('#reciprocal').html(1);
                            $('#pretip').addClass('animated fadeOut');
                            setTimeout(function() {
                                $('#pretip').hide();
                                $('#main').show();
                            }, 1000);
                        }, 1000);
                    }, 500);
                }, 1000);

            }
        });

        $('#yesbutton').click(function(event) {
            if (currentIsObject) {
                $('#main').addClass('animated fadeOut');
                setTimeout(function() {
                    $('#main').hide();
                    $('#loseResult').show();
                }, 1000);
            } else {
                $.ajax({
                    url: '/entity?key=' + currentYesKey,
                    success: function(data, status) {
                        console.log('debug', 'getYesKey', data);
                        console.log('debug', 'getYesKey', JSON.parse(data));
                        data = JSON.parse(data);
                        $('#question p').addClass('animated fadeOut');
                        if (data.isLeaf === 'true') {
                            currentIsObject = true;
                            currentEntity = data.object;
                            $('#question').html('<p class="animated fadeIn">Is ' + data.object + '?</p>');
                        } else {
                            currentIsObject = false;
                            $('#question').html('<p class="animated fadeIn">' + data.question + '</p>');
                        }
                        currentFigureKey = currentYesKey;
                        currentYesKey = data.yesKey;
                        currentNopeKey = data.nopeKey;
                    },
                    error: function(xhr) {
                        console.log('error', 'getYesKey', xhr);
                    }
                });
            }
        });

        $('#nobutton').click(function(event) {
            if (currentNopeKey === 'null') {
                $('#main').addClass('animated fadeOut');
                setTimeout(function() {
                    $('#main').hide();
                    $('#winResult').show();
                }, 1000)
            }
            $.ajax({
                url: '/entity?key=' + currentNopeKey,
                success: function(data, status) {
                    console.log('debug', 'getYesKey', data);
                    data = JSON.parse(data);
                    if (data.miss) {
                        $('#main').addClass('animated fadeOut');
                        setTimeout(function() {
                            $('#main').hide();
                            $('#winResult').show();
                        }, 1000)
                    } else {
                        $('#question p').addClass('animated fadeOut');
                        if (data.isLeaf === 'true') {
                            currentIsObject = true;
                            currentEntity = data.object;
                            $('#question').html('<p class="animated fadeIn">Is ' + data.object + '?</p>');
                        } else {
                            currentIsObject = false;
                            $('#question').html('<p class="animated fadeIn">' + data.question + '</p>');
                        }
                        currentFigureKey = currentNopeKey;
                        currentYesKey = data.yesKey;
                        currentNopeKey = data.nopeKey;
                    }
                },
                error: function(xhr) {
                    console.log('error', 'getYesKey', xhr);
                }
            });
        });

        $('.restartButton').click(function() {
            $('.full-container').addClass('animated fadeOut');
            setTimeout(function() {
                window.location.reload();
            }, 1000);
        });


        $('#helpButton').click(function() {
            $('#winResult').addClass('animated fadeOut');
            setTimeout(function() {
                $('#winResult').hide();
                $('#helpMe').show();
                $('#helpEntity').html(currentEntity);
                $('#thinkingThing,#helpQuestion').val('');
            }, 1000);
        });

        $('#thinkingThing').on('change keyup keypress input', function(event) {
            $('#helpThinking').html($('#thinkingThing').val());
        });

        $('#helpDoneButton').click(function(event) {
            $('helpMe').addClass('animated fadeOut');
            $.ajax({
                type: 'POST',
                url: '/entity',
                data: {
                    figureKey: currentFigureKey,
                    thinkingThing: $('#thinkingThing').val(),
                    question: $('#helpQuestion').val()
                },
                success: function(data, status) {
                    console.log('debug', 'post entity', data);
                    $('#helpMe').addClass('animated fadeOut');
                    setTimeout(function() {
                        $('#helpMe').hide();
                        $('#thank').show();
                    }, 1000);
                },
                error: function(xhr) {
                    console.log('error', xhr);
                }
            });
        });

    });
