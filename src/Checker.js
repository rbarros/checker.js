/*
 * Checker
 * https://github.com/rbarros/checker.js
 *
 * Copyright (c) 2013 Ramon Barros
 * Licensed under the MIT license.
 */
/*jslint devel: true, unparam: true, indent: 4 */
/*global $,document,window,event */
// o ponto-e-vírgula antes de invocar a função é uma prática segura contra scripts
// concatenados e/ou outros plugins que não foram fechados corretamente.
;(function($, window, undefined) {
    'use strict';
    // 'undefined' é usado aqui como a variável global 'undefined', no ECMAScript 3 é
    // mutável (ou seja, pode ser alterada por alguém). 'undefined' não está sendo
    // passado na verdade, assim podemos assegurar que o valor é realmente indefinido.
    // No ES5, 'undefined' não pode mais ser modificado.

    // 'window' e 'document' são passados como variáveis locais ao invés de globais,
    // assim aceleramos (ligeiramente) o processo de resolução e pode ser mais eficiente
    // quando minificado (especialmente quando ambos estão referenciados corretamente).
    //var document = window.document;

    // Collection method.
    $.fn.checker = function(options) {
        var checker, instance = (typeof options == "object" && options.instance) || false;
        if (instance) {
            this.each(function() {
                checker = new $.checker(this, options);
                $.data(this, 'checker', checker);
            });
            return checker;
        } else {
            return this.each(function() {
                $.data(this, 'checker', new $.checker(this, options));
            });
        }
    };

    // Static method.
    $.checker = function(element, options) {
        this.version = '1.1.2';
        this.el = element;
        this.callback_submit = false; // Utilizado para bloquear o submit do formulário
        this.options = $.extend({}, $.checker.options, options);

        this.debug('log', this.options);

        this.init();
    };

    // Static method default options.
    $.checker.options = {
        debug: false, // Ativa/desativa o debug do plugin
        check: false, // Ativa/desativa verificação por ajax, se desativado o plugin utilizará checkStatus
        checkStatus: 'invalid', // Status que será assumido caso o check sejá true
        blockForm: '.formChecker', // Nome da class do formulário que será bloqueado o submit
        imgValid: 'img/valid.png',
        imgInvalid: 'img/invalid.png',
        imgError: 'img/error.png',
        replace: /\W/g, // Expressão regular utilizada no replace do valor do elemento
        num: 4, // Apartir de quantos caracteres será iniciado a verificação do valor
        defaultCss: { // Estilo padrão do elemento
            'background-color': '#FFF',
            'border': '1px solid #CCC',
            'padding': '5px 15px 5px 5px',
            'color': '#000',
            'margin': '0'
        },
        placeholder: '', // Altera o placeholder do element
        errorCss: { // Estilo do elemento quando valor inválido
            'border': '1px solid rgb(197, 0, 0)'
        },
        showErrorText: true, // Se true mostra uma mensagem de error próximo ao elemento
        errorText: 'O campo %s deve ser informado.', // Mensagem de error
        ajax: { // Dados para efetuar a requisição ajax atraves do jQuery
            async: false,
            url: 'php/checker.php',
            type: "POST",
            data: {id: 1},
            dataType: "json"
        },
        // Funcão sucesso do ajax
        done: function(el, status) {
            console.info("success");
        },
        // Funcão error do ajax
        fail: function(el, status) {
            console.error("error");
        },
        // Funcão complete do ajax
        always: function(el, status) {
            console.warn("complete");
        }
    };

    $.checker.prototype.debug = function(type, error) {
        if (this.options.debug === true) {
            console.log('checker:');
            if (type === 'log') { console.log(error); }
            if (type === 'warn') { console.warn(error); }
            if (type === 'error') { console.error(error); }
            if (type === 'info') { console.info(error); }
            if (type === 'clear') { console.clear(); }
        }
    };

    $.checker.prototype.init = function() {
        var self = this, el = $(this.el);
        this.debug('log', 'Initialized');
        this.alterCss();
        this.alterPlaceholder();
        this.checkValue();
        el.on('keyup', {self: self}, self.checkValue);
        el.on('blur', {self: self}, self.checkValue);
    };

    $.checker.prototype.setOption = function(option, value) {
      this.options[option] = value;
      return this;
    },

    $.checker.prototype.alterCss = function() {
        if (typeof this.options.defaultCss === 'object') {
            this.debug('log', 'Alter css element');
            $(this.el).css(this.options.defaultCss);
        }
        return this;
    };

    $.checker.prototype.alterPlaceholder = function() {
        var el = $(this.el), placeholder = this.options.placeholder || el.attr('placeholder') || el.attr('title') || el.attr('name');
        el.attr('placeholder', placeholder);
        this.debug('log', 'Alter placeholder element');
        return this;
    };

    $.checker.prototype.checkValue = function(event) {
        var self = event ? event.data.self : this, key = event ? event.which : true, el = $(self.el);
        self.replaceText();
        self.debug('log', 'Check Value');
        self.debug('log', el.val());
        if (el.val().length > self.options.num && key !== 13) {
            self.debug('info', 'Value ' + el.val().length + ' greater than ' + self.options.num);
            self.check();
        } else if (el.val().length > self.options.num && key === 13) {
            self.callback_submit = false;
            self.check();
        } else if (el.val().length < self.options.num && key !== 13) {
            self.debug('info', 'Value ' + el.val().length + ' less than ' + self.options.num);
            if (el.val().length > 0) {
                el.css(self.invalidCss());
            }
            self.callback_submit = false;
        }
        self.blockForm();
    };

    $.checker.prototype.replaceText = function() {
        var el = $(this.el), text, pattern = this.options.replace || false;
        if(pattern === false) {
            if (el.val() !== '') {
                text = el.val();
                el.val(text.replace(pattern, ''));
            } else {
                text = el.text();
                el.text(text.replace(pattern, ''));
            }
        }
    };

    $.checker.prototype.check = function() {
        var self = this, el = $(this.el), css, status;
        self.debug('info', 'Check element:');
        self.debug('info', el);
        if (self.options.check) {
            status = self.checkData();
        } else {
            status = {
                valid: self.options.checkStatus
            };
        }
        self.debug('info', status);
        css = self.errorCss();
        if (status && status.valid) {
            if (status.valid === 'valid') {
                css = self.validCss();
                self.callback_submit = true;
            } else if (status.valid === 'invalid') {
                css = self.invalidCss();
                self.callback_submit = false;
            } else if (status.valid === 'error') {
                css = self.errorCss();
                self.callback_submit = false;
            }
        }
        el.css(css);
        return this;
    };

    $.checker.prototype.checkData = function() {
        var self, el, name, value, jqxhr, status, request, old, dataInput;
        self = this;
        el = $(self.el);
        name = el.attr('name');
        value  = el.val();
        old = el.data('old');

        self.debug('info', 'Initialized ajax');

        if (!self.options.ajax || !self.options.ajax.url) {
            status = {
                valid: 'error'
            };
            self.debug('error', 'Options ajax or ajax.url not is null');
        } else {
            dataInput = { data: {old: old} };
            self.debug('warn', 'Value old ' + old);
            dataInput.data[name] = value;
            request = $.extend(true, this.options.ajax, dataInput);
            self.debug('warn', 'Request:');
            self.debug('warn', request);
            jqxhr = $.ajax(request);

            if (jqxhr.responseJSON) {
                status = jqxhr.responseJSON;
                self.debug('warn', 'Response is JSON');
            } else {
                if (jqxhr.responseText) {
                    status = eval('(' + jqxhr.responseText + ')');
                    self.debug('warn', 'Response is object');
                } else {
                    status = {
                        valid: 'error'
                    };
                    self.debug('error', 'Response is not object');
                }
            }

            self.debug('info', status);

            jqxhr.done(function() { self.debug('info', 'Callback function done.'); self.options.done(el, status); })
                 .fail(function() { self.debug('error', 'Callback function fail.'); self.options.fail(el, status); })
                 .always(function() { self.debug('warn', 'Callback function always.'); self.options.always(el, status); });

            if (status === 'undefined') {
                status = {
                    valid: 'error'
                };
            }
        }
        return status;
    };

    $.checker.prototype.blockForm = function() {
        var self = this;
        self.debug('info', 'Block form submit');
        self.debug('info', ['callback_submit', self.callback_submit]);
        $('form.form-register').on('click','a', function(event) {
            self.debug('info', ['Click anchor', this]);
            if (!self.callback_submit) {
                event.preventDefault();
                self.errorStyle();
            } else {
                $('form.form-register').submit();
            }
        });
        $(self.options.blockForm).submit(function(event) {
            self.debug('info', ['Click input', this]);
            if (!self.callback_submit) {
                event.preventDefault();
                self.errorStyle();
            } else {
                return true;
            }
        });
    };

    $.checker.prototype.errorStyle = function() {
        var self = this, text, newtext, el = $(this.el), parent = el.parent(), child = $('<span class="login-check-error" style="margin-left:5px;"/>'), pattern = /%s/;
        self.debug('info','Alter style error.');
        if (self.options.showErrorText === true && $('.login-check-error').length <=0 ) {
            newtext = el.data('name') || el.attr('name');
            text = self.options.errorText.replace(pattern, newtext);
            child.text(text);
            parent.append(child);
            child.delay(800).fadeOut();
        }
        if (typeof this.options.errorCss == 'object') {
            el.css(this.options.errorCss);
        }
        return this;
    }

    $.checker.prototype.validCss = function() {
        var validCss = {
            'background-image': 'url(' + this.options.imgValid + ')',
            'background-position': '97% center',
            'background-repeat': 'no-repeat'
        };
        return validCss;
    };

    $.checker.prototype.invalidCss = function() {
        var invalidCss = {
            'background-image': 'url(' + this.options.imgInvalid + ')',
            'background-position': '97% center',
            'background-repeat': 'no-repeat'
        };
        return invalidCss;
    };

    $.checker.prototype.errorCss = function() {
        var errorCss = {
            'background-image': 'url(' + this.options.imgError + ')',
            'background-position': '97% center',
            'background-repeat': 'no-repeat'
        };
        return errorCss;
    };

}(jQuery, window));