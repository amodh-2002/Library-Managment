def validate_member_debt(member):
    """Validate that member's debt doesn't exceed Rs. 500"""
    return member.outstanding_debt < 500

def validate_book_stock(book):
    """Validate that book is available in stock"""
    return book.stock > 0

def validate_isbn(isbn):
    """Basic ISBN validation"""
    return len(isbn) == 13 and isbn.isdigit() 