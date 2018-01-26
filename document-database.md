# Document Database

Show how to create a document database that stores information as JSON.

1.  Data stored in nested JSON structures.
2.  No concurrency support (no transactions, no rollback).
3.  Queries use a subset of [JsonPath](https://github.com/json-path/JsonPath)
    (implemented as chained function calls so that we don't have to write a parser).

This shows:

-   How to create [XPath](https://en.wikipedia.org/wiki/XPath)-inspired query languages
    (this basically takes the place of showing readers how to implement regular expressions).

Complements the relational database proposal.
