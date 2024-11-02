from marshmallow import Schema, fields

class BookSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    author = fields.Str(required=True)
    isbn = fields.Str(required=True)
    publisher = fields.Str()
    stock = fields.Int(required=True)

class MemberSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Str(required=True)
    outstanding_debt = fields.Float(dump_only=True)

class TransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    book_id = fields.Int(required=True)
    member_id = fields.Int(required=True)
    issue_date = fields.DateTime(dump_only=True)
    return_date = fields.DateTime(dump_only=True)
    rent_fee = fields.Float(dump_only=True) 