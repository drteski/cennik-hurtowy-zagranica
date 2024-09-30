<?php
$url = 'https://files.lazienka-rea.com.pl/feed_3.xml';
# $url = 'https://lazienka-rea.com.pl/feed/generate/full_offer';
$xmlDownloadLocation = '../../public/temp/';
$jsonSaveLocation = '../../public/temp/data/';
$productsPerFile = 500; // Updated batch size to 500

function xmlToArray($xml, $options = array())
{
    $defaults = array(
        'namespaceSeparator' => ':',  // to distinguish namespaces
        'attributePrefix' => '$',     // prefix for attributes
        'alwaysArray' => array(),     // tags that should always be arrays
        'autoArray' => true,          // create arrays for tags appearing more than once
        'textContent' => '$',         // key used for text content
        'autoText' => true,           // skip textContent key if no attributes or child nodes
        'keySearch' => false,         // optional search and replace on tag/attribute names
        'keyReplace' => false         // replace values for keySearch
    );
    $options = array_merge($defaults, $options);

    // Handle attributes
    $attributesArray = [];
    $namespaces = $xml->getDocNamespaces();
    $namespaces[''] = null; // Add base (empty) namespace

    foreach ($namespaces as $prefix => $namespace) {
        foreach ($xml->attributes($namespace) as $attributeName => $attribute) {
            if ($options['keySearch']) {
                $attributeName = str_replace($options['keySearch'], $options['keyReplace'], $attributeName);
            }
            $attributeKey = $options['attributePrefix'] . ($prefix ? $prefix . $options['namespaceSeparator'] : '') . $attributeName;
            $attributesArray[$attributeKey] = (string)$attribute;
        }
    }

    // Handle children
    $tagsArray = [];
    foreach ($namespaces as $prefix => $namespace) {
        foreach ($xml->children($namespace) as $childXml) {
            $childArray = xmlToArray($childXml, $options);
            $childTagName = key($childArray);
            $childProperties = current($childArray);

            if ($options['keySearch']) {
                $childTagName = str_replace($options['keySearch'], $options['keyReplace'], $childTagName);
            }
            if ($prefix) {
                $childTagName = $prefix . $options['namespaceSeparator'] . $childTagName;
            }

            if (!isset($tagsArray[$childTagName])) {
                $tagsArray[$childTagName] = in_array($childTagName, $options['alwaysArray']) || !$options['autoArray']
                    ? array($childProperties) : $childProperties;
            } elseif (is_array($tagsArray[$childTagName]) && array_keys($tagsArray[$childTagName]) === range(0, count($tagsArray[$childTagName]) - 1)) {
                $tagsArray[$childTagName][] = $childProperties;
            } else {
                $tagsArray[$childTagName] = array($tagsArray[$childTagName], $childProperties);
            }
        }
    }

    $textContentArray = [];
    $plainText = trim((string)$xml);
    if ($plainText !== '') $textContentArray[$options['textContent']] = $plainText;

    $propertiesArray = !$options['autoText'] || $attributesArray || $tagsArray || ($plainText === '')
        ? array_merge($attributesArray, $tagsArray, $textContentArray)
        : $plainText;

    return array($xml->getName() => $propertiesArray);
}

function fetchXml($url)
{
    echo 'Downloading XML...';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3600);
    $output = curl_exec($ch);
    curl_close($ch);

    // Clean up old files
    array_map('unlink', glob('../../public/temp/*'));
    array_map('unlink', glob('../../public/temp/data/*'));

    echo 'XML Downloaded';
    return $output;
}

function saveJsonFile($data, $filename)
{
    file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
}

// Main Script
$xmlContent = fetchXml($url);
file_put_contents($xmlDownloadLocation . 'feed.xml', $xmlContent);

// Open the XML file in a streaming mode
$reader = new XMLReader();
$reader->open($xmlDownloadLocation . 'feed.xml');

$productCounter = 0;
$fileCounter = 1;
$productBatch = [];

while ($reader->read()) {
    // Check if we are at the beginning of a product node
    if ($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'product') {
        // Load the current node as a SimpleXMLElement
        $node = new SimpleXMLElement($reader->readOuterXML());

        // Convert the XML to array
        $productArray = xmlToArray($node);

        // Add product to the batch
        $productBatch[] = $productArray;
        $productCounter++;

        // Check if we've reached the batch size of 500
        if ($productCounter >= $productsPerFile) {
            // Save the current batch to a JSON file
            saveJsonFile($productBatch, $jsonSaveLocation . 'product-' . $fileCounter . '.json');

            // Clear the batch and reset the counter for memory efficiency
            $productBatch = [];
            $productCounter = 0;
            $fileCounter++;
        }
    }
}

// Save any remaining products that didn't fill up a full batch
if (!empty($productBatch)) {
    saveJsonFile($productBatch, $jsonSaveLocation . 'product-' . $fileCounter . '.json');
}

$reader->close();

$today = date("Y-m-d_H-i-s");
file_put_contents('log_' . $today . '.txt', 'Feed processed successfully.');

echo 'Feed processing complete!';
