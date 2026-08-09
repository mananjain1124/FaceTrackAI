class AppError(Exception):
    """Business-logic error that is converted into a JSON response."""

    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
