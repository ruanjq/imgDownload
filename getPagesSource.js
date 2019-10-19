// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    /*var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;*/

    var imgs = document_root.querySelectorAll("img");
    var urlArrays = [];
    imgs.forEach(function(item, index) {
        var src = item.getAttribute('src') || '';
        if (checkURL(src)) {
            if (src.trim().match(/^http/i) == null) {
                src = "https:" + src;
            }
            urlArrays.push(src);
        }
    });
    return urlArrays;


}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});

function checkURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png|webp)/) != null;
}