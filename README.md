# Checker

Checks if the field value already esists.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/rbarros/checker.js/master/dist/Checker.min.js
[max]: https://raw.github.com/rbarros/checker.js/master/src/Checker.js

In your web page:

```html
<script src="libs/jquery/jquery.js"></script>
<script src="dist/Checker.min.js"></script>
<script>
    jQuery(function($) {
        $('input[name=login]').checker({
            check: true
        });
    });
</script>

<input name="login" />
```

![input checker](https://raw.github.com/rbarros/checker.js/master/img/checker.png)

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History

* **v1.1.2** - 2013-10-24
   - Fix bug blocker submit form by click a anchor.
   - Fix bug when changing style error in the field.

* **v1.1.1** - 2013-10-23
   - Fix bug return instance.

* **v1.1.0** - 2013-10-8
   - Added option to return an instance of the checker, allowing to use the functions.
   - Fix bug in replace.

* **v1.0.0** - 2013-10-7
   - Updated to v0.10.20 node correcting problems using uglify (parse.js:53).
   - Initial release.

## License
> Copyright (c) 2013 Ramon Barros

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
