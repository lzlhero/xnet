<?php
    /**
     * PHP version response method for jQuery.xNet
     */
    function xnet($code = 0, $message = '', $data = '')
    {
        header('Content-Type: text/javascript; charset=utf-8');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Cache-Control: no-store, no-cache, must-revalidate');
        header('Cache-Control: post-check=0, pre-check=0', false);
        header('Pragma: no-cache');

        // code field for json output
        $out = array('code' => $code);
        if ($code < 0) {
            $out['message'] = 'xnet Output Error: the "code" parameter should not less than 0.';
            echo json_encode($out);
            return;
        }

        // message field for json output
        if ($message !== '') {
            $out['message'] = $message;
        }
        else if ($code > 0 && $message === '') {
            $out['message'] = 'xnet Output Error: the "message" parameter should define if the "code" parameter great than 0.' ;
            echo json_encode($out);
            return;
        }

        // data field for json output
        if ($data !== '') {
            $out['data'] = $data;
        }

        // output the json structure as string.
        echo json_encode($out);
    }
?>