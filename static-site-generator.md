# Static Site Generator

Show how to create a static site generator like [Jekyll](https://jekyllrb.com/)
but about the size of [Nanogen](https://github.com/doug2k1/nanogen)
(described in [this blog post](https://medium.com/douglas-matoso-english/build-static-site-generator-nodejs-8969ebe34b22))
that uses [EJS](https://www.npmjs.com/package/ejs) and:

1.  Reads the contents of a configuration file and a source directory tree.
2.  Copies files that don't need translation.
3.  Expands files that do need translation.

This shows:

-   File I/O, directory creation, directory traversal, and other shell-ish things.
-   How to handle configuration files.
-   How template expansion works.
-   (From experience) how working with promises is different from traditional imperative coding.

Notes:

-   We can start by showing how to expand variables in place using regular expressions
    (e.g., replace `<%= thing =%>` with the value of `thing` read from a configuration file)
    as a lead-up to this.
-   We could (?) show how to turn EJS templates inside out,
    turning the HTML into strings and the embedded control structures into functions,
    but that would (?) require us showing readers how to write a parser.
