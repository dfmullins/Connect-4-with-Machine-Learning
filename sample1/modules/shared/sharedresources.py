from django.template import loader

class SharedResources:
    def get_page_resources(self):
        header = self.get_header()
        footer = self.get_footer()
        return header, footer
    
    def get_header(self):
        return loader.get_template('shared/header.html')
    
    def get_footer(self):
        return loader.get_template('shared/footer.html')
