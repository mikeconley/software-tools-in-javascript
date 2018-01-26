# Relational Database

Show how to create a relational (tabular) database that supports a small subset of SQL operations.

1.  Tables stored as uniform JSON structures defined by [JSON Schema](https://spacetelescope.github.io/understanding-json-schema/).
2.  Queries built out of nested function calls.
3.  No concurrency support (no transactions, no rollback).

This shows:

-   How and why to validate data against a schema (done as records are added to a table).
-   How code evaluation works (nested function calls).
-   How lazy evaluation works:
    -   Replace functions with constructors having the same names.
    -   Construct an evaluation tree.
    -   Tell that tree's root node to execute itself (triggers recursive execution).

Complements the document database proposal.
